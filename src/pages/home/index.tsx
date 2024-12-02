/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState, useEffect } from 'react'
import { Loader, Loader2, PlusIcon, TrashIcon, XIcon } from 'lucide-react'
import useBusinessStore from '../../store/buisnessSrore'
import { useNavigate } from 'react-router-dom'


interface Business {
  _id?: string
  business_name: string
  business_location?: string
  business_url?: string
  current_cashflow?: { value?: number; notes?: string[] };
  asking_price?: { value?: number; notes?: string[] };
}

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const { fetchAllBusiness, addBusiness, updateBusiness, deleteBusiness ,business, isLoading, error } = useBusinessStore()
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [newBusiness, setNewBusiness] = useState<Business>({
    business_name: '',
    business_location: '',
    business_url: '',
    current_cashflow: {value:0,notes:[]},
    asking_price: {value:0,notes:[]},
  })
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate('/login')
      
    }
    setIsPageLoading(true)
    const fetchData = async () => {
      const allBusinesses = await fetchAllBusiness()
      setBusinesses(allBusinesses)
      setIsPageLoading(false)
    }
    fetchData()

    return () => {
      console.log('Cleanup on unmount')
    }
  }, [fetchAllBusiness])

  const handleAddBusiness = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setNewBusiness({
      business_name: '',
      business_location: '',
      business_url: '',
      current_cashflow: {value:0,notes:[]},
      asking_price: {value:0,notes:[]},
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBusiness((prev) => ({
      ...prev,
      [name]: name === 'current_cashflow' || name === 'asking_price' 
        ? { ...prev[name], value: parseFloat(value) }
        : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const addedBusiness = await addBusiness(newBusiness)
      setBusinesses([...businesses, addedBusiness])
      console.log(businesses)
      handleClosePopup()
    } catch (error) {
      console.error('Error adding business:', error)
    }
  }

  const handleDeleteBusiness = async (id: string) => {
    try {
      const response = await deleteBusiness(id)
      console.log(response);
      
      setBusinesses(businesses.filter(business => business._id !== id))
    } catch (error) {
      console.error('Error deleting business:', error)
    }
  }

  const handleBusinessClick = (id: string) => {
    navigate(`/business/${id}`)
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Businesses</h1>
          <button
            onClick={handleAddBusiness}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Business
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div 
              key={business._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
              onClick={() => handleBusinessClick(business._id!)}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{business.business_name}</h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Cashflow:</span> ${business.current_cashflow?.value?.toLocaleString()}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Asking Price:</span> ${business.asking_price?.value?.toLocaleString()}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteBusiness(business._id!)
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Business</h2>
              <button onClick={handleClosePopup} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={newBusiness.business_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="business_location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="business_location"
                  name="business_location"
                  value={newBusiness.business_location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="business_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="business_url"
                  name="business_url"
                  value={newBusiness.business_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="current_cashflow" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Cashflow
                </label>
                <input
                  type="number"
                  id="current_cashflow"
                  name="current_cashflow"
                  value={newBusiness.current_cashflow?.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="asking_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Asking Price
                </label>
                <input
                  type="number"
                  id="asking_price"
                  name="asking_price"
                  value={newBusiness.asking_price?.value}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Add Business
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



