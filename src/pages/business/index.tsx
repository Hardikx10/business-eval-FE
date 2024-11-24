'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useNavigate, useParams } from 'react-router-dom';
import useBusinessStore from '../../store/buisnessSrore';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Copy, Grid, Plus, PenSquare, LinkIcon, MessageSquare } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface MetricCardData {
  id: string;
  name: string;
  value: number;
  metricType: '$' | 'X' | 'N' | '%';
  notes: string[];
  
}

interface FormData {
  business_name: string;
  business_location: string;
  business_url: string;
  business_attachments: any[];
  current_cashflow: { value: number; notes: string[] };
  expected_salary: { value: number; notes: string[] };
  gross_revenue: { value: number; notes: string[] };
  growth_rate: { value: number; notes: string[] };
  asking_price: { value: number; notes: string[] };
  sde_value: { value: number; notes: string[] };
  loan_sba: {
    amount: { value: number; notes: string[] };
    rate: { value: number; notes: string[] };
    term: { value: number; notes: string[] };
  };
  loan_additional: {
    amount: { value: number; notes: string[] };
    rate: { value: number; notes: string[] };
    term: { value: number; notes: string[] };
  };
  additional_debt: { value: number; notes: string[] };
  dscr: { value: number; notes: string[] };
  projected_cashflow: { value: number; notes: string[] };
  gross_multiple: { value: number; notes: string[] };
  sde_multiple: { value: number; notes: string[] };
  sba_loan_payment: { value: number; notes: string[] };
  total_debt_payments: { value: number; notes: string[] };
  projected_net_profit_margin: { value: number; notes: string[] };
  business_notes: string[];
  custom_cards_columns: any[];
}

export default function BusinessMetrics() {
  const { fetchBusiness, updateBusiness, business, isLoading, error } = useBusinessStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { id } = useParams();
  const [notes, setNotes] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotesTextarea, setShowNotesTextarea] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [metricCards, setMetricCards] = useState<MetricCardData[]>([]);
  const [editingCard, setEditingCard] = useState<MetricCardData | null>(null);
  const [isClient, setIsClient] = useState(false)
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    business_location: '',
    business_url: '',
    business_attachments: [],
    current_cashflow: { value: 0, notes: [] },
    expected_salary: { value: 0, notes: [] },
    gross_revenue: { value: 0, notes: [] },
    growth_rate: { value: 0, notes: [] },
    asking_price: { value: 0, notes: [] },
    sde_value: { value: 0, notes: [] },
    loan_sba: {
      amount: { value: 0, notes: [] },
      rate: { value: 0, notes: [] },
      term: { value: 0, notes: [] },
    },
    loan_additional: {
      amount: { value: 0, notes: [] },
      rate: { value: 0, notes: [] },
      term: { value: 0, notes: [] },
    },
    additional_debt: { value: 0, notes: [] },
    dscr: { value: 0, notes: [] },
    projected_cashflow: { value: 0, notes: [] },
    gross_multiple: { value: 0, notes: [] },
    sde_multiple: { value: 0, notes: [] },
    sba_loan_payment: { value: 0, notes: [] },
    total_debt_payments: { value: 0, notes: [] },
    projected_net_profit_margin: { value: 0, notes: [] },
    business_notes: [],
    custom_cards_columns: [],
  });

  useEffect(() => {
    setIsClient(true)
  }, [])

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
          value: data.current_cashflow?.value || 0,
          notes: data.current_cashflow?.notes || [],
        },
        expected_salary: {
          value: data.expected_salary?.value || 0,
          notes: data.expected_salary?.notes || [],
        },
        gross_revenue: {
          value: data.gross_revenue?.value || 0,
          notes: data.gross_revenue?.notes || [],
        },
        growth_rate: {
          value: data.growth_rate?.value || 0,
          notes: data.growth_rate?.notes || [],
        },
        asking_price: {
          value: data.asking_price?.value || 0,
          notes: data.asking_price?.notes || [],
        },
        sde_value: {
          value: data.sde_value?.value || 0,
          notes: data.sde_value?.notes || [],
        },
        loan_sba: {
          amount: {
            value: data.loan_sba?.amount?.value || 0,
            notes: data.loan_sba?.amount?.notes || [],
          },
          rate: {
            value: data.loan_sba?.rate?.value || 0,
            notes: data.loan_sba?.rate?.notes || [],
          },
          term: {
            value: data.loan_sba?.term?.value || 0,
            notes: data.loan_sba?.term?.notes || [],
          },
        },
        loan_additional: {
          amount: {
            value: data.loan_additional?.amount?.value || 0,
            notes: data.loan_additional?.amount?.notes || [],
          },
          rate: {
            value: data.loan_additional?.rate?.value || 0,
            notes: data.loan_additional?.rate?.notes || [],
          },
          term: {
            value: data.loan_additional?.term?.value || 0,
            notes: data.loan_additional?.term?.notes || [],
          },
        },
        additional_debt: {
          value: data.additional_debt?.value || 0,
          notes: data.additional_debt?.notes || [],
        },
        dscr: {
          value: data.dscr?.value || 0,
          notes: data.dscr?.notes || [],
        },
        projected_cashflow: {
          value: data.projected_cashflow?.value || 0,
          notes: data.projected_cashflow?.notes || [],
        },
        gross_multiple: {
          value: data.gross_multiple?.value || 0,
          notes: data.gross_multiple?.notes || [],
        },
        sde_multiple: {
          value: data.sde_multiple?.value || 0,
          notes: data.sde_multiple?.notes || [],
        },
        sba_loan_payment: {
          value: data.sba_loan_payment?.value || 0,
          notes: data.sba_loan_payment?.notes || [],
        },
        total_debt_payments: {
          value: data.total_debt_payments?.value || 0,
          notes: data.total_debt_payments?.notes || [],
        },
        projected_net_profit_margin: {
          value: data.projected_net_profit_margin?.value || 0,
          notes: data.projected_net_profit_margin?.notes || [],
        },
        business_notes: data.business_notes || [],
        custom_cards_columns: data.custom_cards_columns || [],
      }));

      const updatedMetricCards: MetricCardData[] = [
        {
          id: 'sales-multiple',
          name: 'Sales Multiple',
          value: 3,
          metricType: 'X',
          notes: ['Based on industry average'],
        },
        {
          id: 'assets',
          name: 'Assets',
          value: 356800,
          metricType: '$',
          notes: ['Includes all tangible and intangible assets'],
        },
        {
          id: 'gross-revenue',
          name: 'Gross Revenue',
          value: data.gross_revenue?.value || 0,
          metricType: '$',
          notes: data.gross_revenue?.notes || ['Awaiting latest financial reports'],
        },
        {
          id: 'current-cashflow',
          name: 'Current Cash Flow',
          value: data.current_cashflow?.value || 0,
          metricType: '$',
          notes: data.current_cashflow?.notes || ['Current cash flow'],
        },
        {
          id: 'expected-salary',
          name: 'Expected Salary',
          value: data.expected_salary?.value || 0,
          metricType: '$',
          notes: data.expected_salary?.notes || ['Expected salary'],
        },
        {
          id: 'growth-rate',
          name: 'Growth Rate',
          value: data.growth_rate?.value || 0,
          metricType: '%',
          notes: data.growth_rate?.notes || ['Annual growth rate'],
        },
        {
          id: 'asking-price',
          name: 'Asking Price',
          value: data.asking_price?.value || 0,
          metricType: '$',
          notes: data.asking_price?.notes || ['Current owner\'s requested sale price'],
        },
        {
          id: 'sde-value',
          name: 'SDE Value',
          value: data.sde_value?.value || 0,
          metricType: '$',
          notes: data.sde_value?.notes || ['Seller\'s Discretionary Earnings'],
        },
        {
          id: 'loan-sba-amount',
          name: 'SBA Loan Amount',
          value: data.loan_sba?.amount?.value || 0,
          metricType: '$',
          notes: data.loan_sba?.amount?.notes || ['SBA loan amount'],
        },
        {
          id: 'loan-sba-rate',
          name: 'SBA Loan Rate',
          value: data.loan_sba?.rate?.value || 0,
          metricType: '%',
          notes: data.loan_sba?.rate?.notes || ['SBA loan interest rate'],
        },
        {
          id: 'loan-sba-term',
          name: 'SBA Loan Term',
          value: data.loan_sba?.term?.value || 0,
          metricType: 'N',
          notes: data.loan_sba?.term?.notes || ['SBA loan term in years'],
        },
        {
          id: 'loan-additional-amount',
          name: 'Additional Loan Amount',
          value: data.loan_additional?.amount?.value || 0,
          metricType: '$',
          notes: data.loan_additional?.amount?.notes || ['Additional loan amount'],
        },
        {
          id: 'loan-additional-rate',
          name: 'Additional Loan Rate',
          value: data.loan_additional?.rate?.value || 0,
          metricType: '%',
          notes: data.loan_additional?.rate?.notes || ['Additional loan interest rate'],
        },
        {
          id: 'loan-additional-term',
          name: 'Additional Loan Term',
          value: data.loan_additional?.term?.value || 0,
          metricType: 'N',
          notes: data.loan_additional?.term?.notes || ['Additional loan term in years'],
        },
        {
          id: 'additional-debt',
          name: 'Additional Debt',
          value: data.additional_debt?.value || 0,
          metricType: '$',
          notes: data.additional_debt?.notes || ['Additional debt'],
        },
        {
          id: 'dscr',
          name: 'DSCR',
          value: data.dscr?.value || 0,
          metricType: 'N',
          notes: data.dscr?.notes || ['Debt Service Coverage Ratio'],
        },
        {
          id: 'projected-cashflow',
          name: 'Projected Cash Flow',
          value: data.projected_cashflow?.value || 0,
          metricType: '$',
          notes: data.projected_cashflow?.notes || ['Projected annual cash flow'],
        },
        {
          id: 'gross-multiple',
          name: 'Gross Multiple',
          value: data.gross_multiple?.value || 0,
          metricType: 'X',
          notes: data.gross_multiple?.notes || ['Gross revenue multiple'],
        },
        {
          id: 'sde-multiple',
          name: 'SDE Multiple',
          value: data.sde_multiple?.value || 0,
          metricType: 'X',
          notes: data.sde_multiple?.notes || ['SDE multiple'],
        },
        {
          id: 'sba-loan-payment',
          name: 'SBA Loan Payment',
          value: data.sba_loan_payment?.value || 0,
          metricType: '$',
          notes: data.sba_loan_payment?.notes || ['Monthly SBA loan payment'],
        },
        {
          id: 'total-debt-payments',
          name: 'Total Debt Payments',
          value: data.total_debt_payments?.value || 0,
          metricType: '$',
          notes: data.total_debt_payments?.notes || ['Total monthly debt payments'],
        },
        {
          id: 'projected-net-profit-margin',
          name: 'Projected Net Profit Margin',
          value: data.projected_net_profit_margin?.value || 0,
          metricType: '%',
          notes: data.projected_net_profit_margin?.notes || ['Projected net profit margin'],
        }
      ];
  
      setMetricCards(updatedMetricCards);;
    }
  }, [business]);

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

  const toggleNotesTextarea = () => {
    setShowNotesTextarea(!showNotesTextarea);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSaveNotes = async () => {
    if (notes.trim()) {
      try {
        setFormData(prevState => ({
          ...prevState,
          business_notes: [notes.trim(), ...formData.business_notes]
        }));

        const updatedBusiness = await updateBusiness(id, {
          business_notes: [notes.trim(), ...formData.business_notes]
        });
  
       
        setNotes('');
        setIsTyping(false);
        setShowNotesTextarea(false);
        toast.success('Note saved successfully!');
      } catch (error) {
        toast.error('Failed to save note. Please try again.');
        console.error('Error saving note:', error);
      }
    }
  };

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    try {
      const updatedData = {
        business_name: formData.business_name,
        business_location: formData.business_location,
        business_url: formData.business_url
      };

      const updatedBusiness = await updateBusiness(id, updatedData);

      if (updatedBusiness) {
        setFormData(prevState => ({
          ...prevState,
          ...updatedData
        }));
        setIsEditDialogOpen(false);
        toast.success('Business details updated successfully!');
      } else {
        throw new Error('Failed to update business details');
      }
    } catch (error) {
      console.error('Error updating business details:', error);
      toast.error('Failed to update business details. Please try again.');
    }
  };

    const toggleShowAllNotes = () => {
      setShowAllNotes(!showAllNotes);
    };

    const reorder =(list ,startIndex, endIndex)=>{

      const result = Array.from(list)
      const [removed] = result.splice(startIndex,1)
      result.splice(endIndex,0,removed)
      return result;

    }

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
  
      const reorderedItems:any = reorder(metricCards,result.source.index,result.destination.index)
      console.log(reorder);
      
      setMetricCards(reorderedItems);
    };
  const handleCardClick = (card: MetricCardData) => {
    setEditingCard(card);
  };

  const handleCardSave = (newData: MetricCardData) => {
    setMetricCards(prevCards =>
      prevCards.map(card => (card.id === newData.id ? { ...card, ...newData } : card))
    );
    setEditingCard(null);
  };

  const handleCardCancel = () => {
    setEditingCard(null);
  };

  const handleAddNewCard = () => {
    const newMetric: MetricCardData = {
      id: `metric-${Date.now()}`,
      name: 'New Metric',
      value: 0,
      metricType: 'N',
      notes: [],
    };
    setEditingCard(newMetric);
  };

  if (isLoading) {
    return(<div>Loading...</div>);
  }

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
      <div className="p-4 -mt-2"> {/* Moved up by adding negative top margin */}
        {/* Info Card */}
        <div 
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 mb-3 cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleEditDialogOpen}
        >
          <div className="flex justify-between">
            {/* Business Info */}
            <div className="flex-grow pr-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h2 className="text-base text-xl font-semibold">
                    {formData.business_name}
                  </h2>
                  <p className="text-gray-500 text-xs">{formData.business_location}</p>
                  <div className="flex items-center mt-0.5">
                    <LinkIcon className="w-3 h-3 text-blue-500 mr-1" />
                    <a href={formData.business_url} className="text-blue-500 text-xs hover:underline">{formData.business_url}</a>
                  </div>
                </div>
              </div>
              
              <div className="mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Researching
                </span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <span>Updated 2 hours ago</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="w-1/3 flex flex-col items-end relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNotesTextarea();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg text-blue-500 absolute top-0 right-0"
              >
                <PenSquare className="w-3 h-3" />
              </button>
              {showNotesTextarea && (
                <div className="w-full mt-6" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Enter notes..."
                    className="w-full px-2 py-1 text-xs text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  {isTyping && (
                    <button
                      onClick={handleSaveNotes}
                      className="mt-1 px-2 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Note
                    </button>
                  )}
                </div>
              )}
              {formData.business_notes.length > 0 && (
                <div className="w-full mt-6 text-left pl-2">
                  <ul className="list-disc list-inside">
                    {formData.business_notes.slice(0, showAllNotes ? undefined : 1).map((note, index) => (
                      <li key={index} className="text-xs text-gray-600 mb-0.5">{note}</li>
                    ))}
                  </ul>
                  {formData.business_notes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShowAllNotes();
                      }}
                      className="text-blue-500 text-xs hover:underline mt-0.5"
                    >
                      {showAllNotes ? "View less..." : "View more..."}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="metrics-grid" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '12px',
                  padding: '12px',
                  minHeight: '100px'
                }}
                className="bg-blue-50 rounded-lg"
              >
                {metricCards.map((card, index) => (
                  <Draggable
                     
                    key={card.id} 
                    draggableId={card.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1
                        }}
                      >
                        <div {...provided.dragHandleProps} className="h-full">
                          <MetricCard
                            {...card}
                            onClick={() => handleCardClick(card)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddNewCard onClick={handleAddNewCard} />
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Business Details</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.business_location}
                    onChange={(e) => setFormData({ ...formData, business_location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Website URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={formData.business_url}
                    onChange={(e) => setFormData({ ...formData, business_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleEditDialogClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Metric Card Edit Dialog */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCard.id.startsWith('metric-') ? 'Add New Metric' : 'Edit Metric'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCardSave(editingCard);
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Metric Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editingCard.name}
                    onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <input
                    type="number"
                    id="value"
                    value={editingCard.value}
                    onChange={(e) => setEditingCard({ ...editingCard, value: parseFloat(e.target.value) || 0 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="metricType" className="block text-sm font-medium text-gray-700">
                    Metric Type
                  </label>
                  <select
                    id="metricType"
                    value={editingCard.metricType}
                    onChange={(e) => setEditingCard({ ...editingCard, metricType: e.target.value as '$' | 'X' | 'N' | '%' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="$">$</option>
                    <option value="X">X</option>
                    <option value="N">N</option>
                    <option value="%">%</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={editingCard.notes.join('\n')}
                    onChange={(e) => setEditingCard({ ...editingCard, notes: e.target.value.split('\n') })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


interface MetricCardProps extends MetricCardData {
  onClick: () => void;
}
function MetricCard({
  id,
  name,
  value,
  metricType,
  notes,
  onClick,
}: MetricCardProps) {
  const formatValueAndColor = () => {
    let formattedValue: string;
    let colorClasses: string;

    switch (metricType) {
      case '$':
        formattedValue = `$${value.toLocaleString()}`;
        colorClasses = 'text-purple-500';
        break;
      case 'X':
        formattedValue = `${value}X`;
        colorClasses = 'text-yellow-500';
        break;
      case '%':
        formattedValue = `${value}%`;
        colorClasses = 'text-red-500';
        break;
      default:
        formattedValue = value.toLocaleString();
        colorClasses = 'text-gray-800';
    }

    return { formattedValue, colorClasses };
  };

  const { formattedValue, colorClasses } = formatValueAndColor();

  return (
    <div 
      className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-medium text-gray-500 truncate">{name}</h3>
        <MessageSquare className="w-4 h-4 text-gray-400" />
      </div>
      <div className="flex items-center gap-1 mb-1">
        <span className={`text-base font-semibold ${colorClasses}`}>{formattedValue}</span>
      </div>
      {notes.length > 0 && (
        <p className="text-xs text-gray-600 truncate">{notes[0]}</p>
      )}
    </div>
  )
}

function AddNewCard({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex mt-3" onClick={onClick}>
      <div className="rounded-full bg-gray-50 p-3 mb-2">
          <Plus className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}



