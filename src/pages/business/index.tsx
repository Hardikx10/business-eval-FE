/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
'use client'

import { useNavigate, useParams } from 'react-router-dom';
import useBusinessStore from '../../store/buisnessSrore';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Copy, Grid, MessageSquare, PenSquare, Plus, RotateCcw } from 'lucide-react'


type FormData = {
  business_name: string;
  business_location: string;
  business_url: string;
  business_attachments: any[]; 
  current_cashflow: { value: string; notes: string[] };
  expected_salary: { value: string; notes: string[] };
  gross_revenue: { value: string; notes: string[] };
  growth_rate: { value: string; notes: string[] };
  asking_price: { value: string; notes: string[] };
  sde_value: { value: string; notes: string[] };
  loan_sba: {
    amount: { value: string; notes: string[] };
    rate: { value: string; notes: string[] };
    term: { value: string; notes: string[] };
  };
  loan_additional: {
    amount: { value: string; notes: string[] };
    rate: { value: string; notes: string[] };
    term: { value: string; notes: string[] };
  };
  additional_debt: { value: string; notes: string[] };
  dscr: { value: string; notes: string[] };
  projected_cashflow: { value: string; notes: string[] };
  gross_multiple: { value: string; notes: string[] };
  sde_multiple: { value: string; notes: string[] };
  sba_loan_payment: { value: string; notes: string[] };
  total_debt_payments: { value: string; notes: string[] };
  projected_net_profit_margin: { value: string; notes: string[] };
  business_notes: string[];
  custom_cards_columns: any[]; 
};

export default function BusinessMetrics() {
  const { fetchBusiness, updateBusiness, business, isLoading, error } = useBusinessStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotesTextarea, setShowNotesTextarea] = useState(false);
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    business_location: '',
    business_url: '',
    business_attachments: [],
    current_cashflow: { value: '', notes: [] },
    expected_salary: { value: '', notes: [] },
    gross_revenue: { value: '', notes: [] },
    growth_rate: { value: '', notes: [] },
    asking_price: { value: '', notes: [] },
    sde_value: { value: '', notes: [] },
    loan_sba: {
      amount: { value: '', notes: [] },
      rate: { value: '', notes: [] },
      term: { value: '', notes: [] },
    },
    loan_additional: {
      amount: { value: '', notes: [] },
      rate: { value: '', notes: [] },
      term: { value: '', notes: [] },
    },
    additional_debt: { value: '', notes: [] },
    dscr: { value: '', notes: [] },
    projected_cashflow: { value: '', notes: [] },
    gross_multiple: { value: '', notes: [] },
    sde_multiple: { value: '', notes: [] },
    sba_loan_payment: { value: '', notes: [] },
    total_debt_payments: { value: '', notes: [] },
    projected_net_profit_margin: { value: '', notes: [] },
    business_notes: [],
    custom_cards_columns: [],
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (business?.business?.data) {
      const data = business.business.data;
      setFormData(prevState => ({
        ...prevState,
        business_name: data.business_name || '',
        business_location: data.business_location || '',
        business_url: data.business_url || '',
        business_attachments: data.business_attachments || [],
        current_cashflow: {
          value: data.current_cashflow?.value || '',
          notes: data.current_cashflow?.notes || [],
        },
        expected_salary: {
          value: data.expected_salary?.value || '',
          notes: data.expected_salary?.notes || [],
        },
        gross_revenue: {
          value: data.gross_revenue?.value || '',
          notes: data.gross_revenue?.notes || [],
        },
        growth_rate: {
          value: data.growth_rate?.value || '',
          notes: data.growth_rate?.notes || [],
        },
        asking_price: {
          value: data.asking_price?.value || '',
          notes: data.asking_price?.notes || [],
        },
        sde_value: {
          value: data.sde_value?.value || '',
          notes: data.sde_value?.notes || [],
        },
        loan_sba: {
          amount: {
            value: data.loan_sba?.amount?.value || '',
            notes: data.loan_sba?.amount?.notes || [],
          },
          rate: {
            value: data.loan_sba?.rate?.value || '',
            notes: data.loan_sba?.rate?.notes || [],
          },
          term: {
            value: data.loan_sba?.term?.value || '',
            notes: data.loan_sba?.term?.notes || [],
          },
        },
        loan_additional: {
          amount: {
            value: data.loan_additional?.amount?.value || '',
            notes: data.loan_additional?.amount?.notes || [],
          },
          rate: {
            value: data.loan_additional?.rate?.value || '',
            notes: data.loan_additional?.rate?.notes || [],
          },
          term: {
            value: data.loan_additional?.term?.value || '',
            notes: data.loan_additional?.term?.notes || [],
          },
        },
        additional_debt: {
          value: data.additional_debt?.value || '',
          notes: data.additional_debt?.notes || [],
        },
        dscr: {
          value: data.dscr?.value || '',
          notes: data.dscr?.notes || [],
        },
        projected_cashflow: {
          value: data.projected_cashflow?.value || '',
          notes: data.projected_cashflow?.notes || [],
        },
        gross_multiple: {
          value: data.gross_multiple?.value || '',
          notes: data.gross_multiple?.notes || [],
        },
        sde_multiple: {
          value: data.sde_multiple?.value || '',
          notes: data.sde_multiple?.notes || [],
        },
        sba_loan_payment: {
          value: data.sba_loan_payment?.value || '',
          notes: data.sba_loan_payment?.notes || [],
        },
        total_debt_payments: {
          value: data.total_debt_payments?.value || '',
          notes: data.total_debt_payments?.notes || [],
        },
        projected_net_profit_margin: {
          value: data.projected_net_profit_margin?.value || '',
          notes: data.projected_net_profit_margin?.notes || [],
        },
        business_notes: data.business_notes || [],
        custom_cards_columns: data.custom_cards_columns || [],
      }));
    }
  }, [business]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      fetchBusiness(id);
    }
  }, [fetchBusiness, id]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      const res = await updateBusiness(id, formData);
      if (res) {
        fetchBusiness(id);
      }
      toast.success('Business data updated successfully!');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleSave = async () => {
    await handleUpdate();
    closeModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    window.location.href = '/';
  };

  if (isLoading) {
    return(<div>Loading...</div>);
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const toggleNotesTextarea = () => {
    setShowNotesTextarea(!showNotesTextarea);
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      setFormData(prevState => ({
        ...prevState,
        business_notes: [...prevState.business_notes, notes.trim()]
      }));
      setNotes('');
      setIsTyping(false);
      setShowNotesTextarea(false);
      toast.success('Note saved successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Grid className="w-5 h-5 text-blue-500" />
        </button>
        <h1 className="text-blue-600 font-medium">
          {formData.business_name}
        </h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Copy className="w-5 h-5 text-blue-500" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Info Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <div className="flex justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold">
                    {formData.business_name}
                  </h2>
                  <p className="text-gray-500 text-sm">{formData.business_location}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Researching
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>Updated 2 hours ago</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="w-1/3 flex flex-col items-end">
              <button
                onClick={toggleNotesTextarea}
                className="p-1 hover:bg-gray-100 rounded-lg text-blue-500 mb-2"
              >
                <PenSquare className="w-4 h-4" />
              </button>
              {showNotesTextarea && (
                <div className="w-full mt-2">
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Enter notes..."
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  {isTyping && (
                    <button
                      onClick={handleSaveNotes}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Note
                    </button>
                  )}
                </div>
              )}
              {formData.business_notes.length > 0 && (
                <div className="w-full mt-2 text-right">
                  <ul className="list-none">
                    {formData.business_notes.slice(-3).map((note, index) => (
                      <li key={index} className="text-sm text-gray-600 truncate">{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Sales Multiple"
            value="3X"
            updatedText="Updated just now by You"
          />
          <MetricCard
            title="Assets"
            value="$356,800.00"
            updatedText="Updated just now by You"
          />
          <MetricCard
            title="Gross Revenue"
            value="$0.00"
            updatedText="Updated 2 hours ago by Bizzed Ai"
          />
          <MetricCard
            title="test"
            value="$0.00"
            updatedText="Updated just now by You"
          />
          <MetricCard
            title="Asking Price"
            value="$1,300,000.00"
            valueColor="text-green-500"
            updatedText="Updated 2 hours ago by You"
          />
          <MetricCard
            title="Debt to Equity Ratio"
            value="$1.20"
            updatedText="Updated just now by You"
          />
          <MetricCard
            title="Net Cash Flow"
            value="$0.00"
            updatedText="Updated 2 hours ago by New"
          />
          <MetricCard
            title="Cash on Cash Return"
            value="22%"
            valueColor="text-yellow-500"
            updatedText="Updated just now by You"
          />
          <AddNewCard />
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  updatedText: string
  valueColor?: string
}

function MetricCard({ 
  title,   
  value,   
  updatedText,
  valueColor ="text-gray-900",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <MessageSquare className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-lg font-semibold ${valueColor}`}>{value}</span>
      </div>
      <p className="text-xs text-gray-500">{updatedText}</p>
    </div>
  )
}

function AddNewCard() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 border-dashed hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex flex-col items-center justify-center h-[104px] text-gray-400">
        <Plus className="w-6 h-6 mb-1" />
        <span className="text-sm">Add New</span>
      </div>
    </div>
  )
}



