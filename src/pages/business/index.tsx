'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { useNavigate, useParams } from 'react-router-dom';
import useBusinessStore from '../../store/buisnessSrore';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Copy, Grid, Plus, PenSquare, LinkIcon, MessageSquare, Lock, ChevronDownIcon, XIcon, Trash2 } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface MetricCardData {
  id: string;
  name: string;
  value: number;
  metricType: '$' | 'X' | 'N' | '%';
  notes: string[];
  isIndependent: boolean;
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
  custom_cards_columns: MetricCardData[];
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
  const [newCardData, setNewCardData] = useState<MetricCardData>({
    id: '',
    name: '',
    value: 0,
    metricType: '%',
    notes: [],
    isIndependent: true
  });
  const [isNewCardModalOpen, setIsNewCardModalOpen] = useState(false);
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
      const data = business.business.data
      const updatedFormData = {
        ...formData,
        business_name: data.business_name || '',
        business_location: data.business_location || '',
        business_url: data.business_url || '',
        business_attachments: data.business_attachments || [],
        current_cashflow: data.current_cashflow || { value: 0, notes: [] },
        expected_salary: data.expected_salary || { value: 0, notes: [] },
        gross_revenue: data.gross_revenue || { value: 0, notes: [] },
        growth_rate: data.growth_rate || { value: 0, notes: [] },
        asking_price: data.asking_price || { value: 0, notes: [] },
        sde_value: data.sde_value || { value: 0, notes: [] },
        loan_sba: {
          amount: data.loan_sba?.amount || { value: 0, notes: [] },
          rate: data.loan_sba?.rate || { value: 0, notes: [] },
          term: data.loan_sba?.term || { value: 0, notes: [] },
        },
        loan_additional: {
          amount: data.loan_additional?.amount || { value: 0, notes: [] },
          rate: data.loan_additional?.rate || { value: 0, notes: [] },
          term: data.loan_additional?.term || { value: 0, notes: [] },
        },
        additional_debt: data.additional_debt || { value: 0, notes: [] },
        dscr: data.dscr || { value: 0, notes: [] },
        projected_cashflow: data.projected_cashflow || { value: 0, notes: [] },
        gross_multiple: data.gross_multiple || { value: 0, notes: [] },
        sde_multiple: data.sde_multiple || { value: 0, notes: [] },
        sba_loan_payment: data.sba_loan_payment || { value: 0, notes: [] },
        total_debt_payments: data.total_debt_payments || { value: 0, notes: [] },
        projected_net_profit_margin: data.projected_net_profit_margin || { value: 0, notes: [] },
        business_notes: data.business_notes || [],
        custom_cards_columns: data.custom_cards_columns || [],
      }

      setFormData(updatedFormData)

      const updatedMetricCards: MetricCardData[] = [
        { id: 'current_cashflow', name: 'Current Cashflow', value: updatedFormData.current_cashflow.value, metricType: '$', notes: updatedFormData.current_cashflow.notes, isIndependent: true },
        { id: 'expected_salary', name: 'Expected Salary', value: updatedFormData.expected_salary.value, metricType: '$', notes: updatedFormData.expected_salary.notes, isIndependent: true },
        { id: 'gross_revenue', name: 'Gross Revenue', value: updatedFormData.gross_revenue.value, metricType: '$', notes: updatedFormData.gross_revenue.notes, isIndependent: true },
        { id: 'growth_rate', name: 'Growth Rate', value: updatedFormData.growth_rate.value, metricType: '%', notes: updatedFormData.growth_rate.notes, isIndependent: true },
        { id: 'asking_price', name: 'Asking Price', value: updatedFormData.asking_price.value, metricType: '$', notes: updatedFormData.asking_price.notes, isIndependent: true },
        { id: 'sde_value', name: 'SDE Value', value: updatedFormData.sde_value.value, metricType: '$', notes: updatedFormData.sde_value.notes, isIndependent: true },
        { id: 'sba_loan_amount', name: 'SBA Loan Amount', value: updatedFormData.loan_sba.amount.value, metricType: '$', notes: updatedFormData.loan_sba.amount.notes, isIndependent: true },
        { id: 'sba_loan_rate', name: 'SBA Loan Rate', value: updatedFormData.loan_sba.rate.value, metricType: '%', notes: updatedFormData.loan_sba.rate.notes, isIndependent: true },
        { id: 'sba_loan_term', name: 'SBA Loan Term', value: updatedFormData.loan_sba.term.value, metricType: 'N', notes: updatedFormData.loan_sba.term.notes, isIndependent: true },
        { id: 'additional_loan_amount', name: 'Additional Loan Amount', value: updatedFormData.loan_additional.amount.value, metricType: '$', notes: updatedFormData.loan_additional.amount.notes, isIndependent: true },
        { id: 'additional_loan_rate', name: 'Additional Loan Rate', value: updatedFormData.loan_additional.rate.value, metricType: '%', notes: updatedFormData.loan_additional.rate.notes, isIndependent: true },
        { id: 'additional_loan_term', name: 'Additional Loan Term', value: updatedFormData.loan_additional.term.value, metricType: 'N', notes: updatedFormData.loan_additional.term.notes, isIndependent: true },
        { id: 'additional_debt', name: 'Additional Debt', value: updatedFormData.additional_debt.value, metricType: '$', notes: updatedFormData.additional_debt.notes, isIndependent: true },
        { id: 'dscr', name: 'DSCR', value: updatedFormData.dscr.value, metricType: 'N', notes: updatedFormData.dscr.notes, isIndependent: false },
        { id: 'projected_cashflow', name: 'Projected Cashflow', value: updatedFormData.projected_cashflow.value, metricType: '$', notes: updatedFormData.projected_cashflow.notes, isIndependent: false },
        { id: 'gross_multiple', name: 'Gross Multiple', value: updatedFormData.gross_multiple.value, metricType: 'X', notes: updatedFormData.gross_multiple.notes, isIndependent: false },
        { id: 'sde_multiple', name: 'SDE Multiple', value: updatedFormData.sde_multiple.value, metricType: 'X', notes: updatedFormData.sde_multiple.notes, isIndependent: false },
        { id: 'sba_loan_payment', name: 'SBA Loan Payment', value: updatedFormData.sba_loan_payment.value, metricType: '$', notes: updatedFormData.sba_loan_payment.notes, isIndependent: false },
        { id: 'total_debt_payments', name: 'Total Debt Payments', value: updatedFormData.total_debt_payments.value, metricType: '$', notes: updatedFormData.total_debt_payments.notes, isIndependent: false },
        { id: 'projected_net_profit_margin', name: 'Projected Net Profit Margin', value: updatedFormData.projected_net_profit_margin.value, metricType: '%', notes: updatedFormData.projected_net_profit_margin.notes, isIndependent: false },
        ...updatedFormData.custom_cards_columns,
      ]

      setMetricCards(updatedMetricCards)
    }
  }, [business])

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

    const calculateDependentKPIs = useMemo(() => {
      return (cards: MetricCardData[]) => {
        const getCardValue = (id: string) => cards.find(card => card.id === id)?.value || 0
  
        const currentCashflow = getCardValue('current_cashflow')
        const expectedSalary = getCardValue('expected_salary')
        const grossRevenue = getCardValue('gross_revenue')
        const askingPrice = getCardValue('asking_price')
        const sdeValue = getCardValue('sde_value')
        const newExpenses = getCardValue('new_expenses')
        const sbaLoanAmount = getCardValue('sba_loan_amount')
        const sbaLoanRate = getCardValue('sba_loan_rate')
        const sbaLoanTerm = getCardValue('sba_loan_term')
        const additionalLoanAmount = getCardValue('additional_loan_amount')
        const additionalLoanRate = getCardValue('additional_loan_rate')
        const additionalLoanTerm = getCardValue('additional_loan_term')
        const additionalDebt = getCardValue('additional_debt')
        
        
        
        
        // Calculate SBA Loan Payment
        const sbaLoanPayment = sbaLoanAmount > 0 ? 
          (sbaLoanAmount * (sbaLoanRate / 1200)) / (1 - Math.pow(1 + (sbaLoanRate / 1200), -sbaLoanTerm * 12)) : 0
  
        // Calculate Additional Loan Payment
        const additionalLoanPayment = additionalLoanAmount > 0 ?
          (additionalLoanAmount * (additionalLoanRate / 1200)) / (1 - Math.pow(1 + (additionalLoanRate / 1200), -additionalLoanTerm * 12)) : 0
  
        // Calculate Total Debt Payments
        const totalDebtPayments = sbaLoanPayment + additionalLoanPayment + additionalDebt
  
        // Calculate Dependent KPIs
        const dscr = totalDebtPayments > 0 ? (currentCashflow + expectedSalary) / totalDebtPayments : 0
        const projectedCashflow = currentCashflow - totalDebtPayments - newExpenses
        const grossMultiple = grossRevenue > 0 ? askingPrice / grossRevenue : 0
        const sdeMultiple = sdeValue > 0 ? askingPrice / sdeValue : 0
        const projectedNetProfitMargin = grossRevenue > 0 ? (projectedCashflow / grossRevenue) * 100 : 0

        // console.log(sdeMultiple);
        
        return cards.map(card => {
          switch (card.id) {
            case 'dscr':
              return { ...card, value: dscr }
            case 'projected_cashflow':
              return { ...card, value: projectedCashflow }
            case 'gross_multiple':
              return { ...card, value: grossMultiple }
            case 'sde_multiple':
              return { ...card, value: sdeMultiple }
            case 'sba_loan_payment':
              return { ...card, value: sbaLoanPayment }
            case 'total_debt_payments':
              return { ...card, value: totalDebtPayments }
            case 'projected_net_profit_margin':
              return { ...card, value: projectedNetProfitMargin }
            default:
              return card
          }
        })
      }
    }, [])
  
    useEffect(() => {
      setMetricCards(prevCards => calculateDependentKPIs(prevCards))
    }, [calculateDependentKPIs])
  
    const handleCardClick = (card: MetricCardData) => {
      setEditingCard(card)
    }
  
    const handleCardSave = async (updatedCard: MetricCardData) => {
      try {
        setEditingCard(null);
    
        const updatedCards = metricCards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        );
        const recalculatedCards = calculateDependentKPIs(updatedCards);
        setMetricCards(recalculatedCards);
       
        const updatedFormData = {
          ...formData,
          custom_cards_columns: [] // Initialize custom_cards_columns
        };
    
        const parseNumber = (value: any): number => {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? 0 : parsed;
        };
    
        recalculatedCards.forEach(card => {
          if (!card || typeof card !== 'object' || !card.id) {
            console.warn('Invalid card encountered:', card);
            return; // Skip this iteration
          }
    
          const numericValue = parseNumber(card.value);
          
          if (card.id.startsWith('custom-')) {
            // Add all custom cards to custom_cards_columns, removing _id
            const { _id, ...cardWithoutId }:any = card;
            updatedFormData.custom_cards_columns.push(cardWithoutId);
          } else {
            // Handle non-custom cards
            switch (card.id) {
              case 'current_cashflow':
                updatedFormData.current_cashflow = { value: numericValue, notes: card.notes };
                break;
              case 'expected_salary':
                updatedFormData.expected_salary = { value: numericValue, notes: card.notes };
                break;
              case 'gross_revenue':
                updatedFormData.gross_revenue = { value: numericValue, notes: card.notes };
                break;
              case 'growth_rate':
                updatedFormData.growth_rate = { value: numericValue, notes: card.notes };
                break;
              case 'asking_price':
                updatedFormData.asking_price = { value: numericValue, notes: card.notes };
                break;
              case 'sde_value':
                updatedFormData.sde_value = { value: numericValue, notes: card.notes };
                break;
              case 'sba_loan_amount':
                updatedFormData.loan_sba.amount = { value: numericValue, notes: card.notes };
                break;
              case 'sba_loan_rate':
                updatedFormData.loan_sba.rate = { value: numericValue, notes: card.notes };
                break;
              case 'sba_loan_term':
                updatedFormData.loan_sba.term = { value: numericValue, notes: card.notes };
                break;
              case 'additional_loan_amount':
                updatedFormData.loan_additional.amount = { value: numericValue, notes: card.notes };
                break;
              case 'additional_loan_rate':
                updatedFormData.loan_additional.rate = { value: numericValue, notes: card.notes };
                break;
              case 'additional_loan_term':
                updatedFormData.loan_additional.term = { value: numericValue, notes: card.notes };
                break;
              case 'additional_debt':
                updatedFormData.additional_debt = { value: numericValue, notes: card.notes };
                break;
              case 'dscr':
                updatedFormData.dscr = { value: numericValue, notes: card.notes };
                break;
              case 'projected_cashflow':
                updatedFormData.projected_cashflow = { value: numericValue, notes: card.notes };
                break;
              case 'gross_multiple':
                updatedFormData.gross_multiple = { value: numericValue, notes: card.notes };
                break;
              case 'sde_multiple':
                updatedFormData.sde_multiple = { value: numericValue, notes: card.notes };
                break;
              case 'sba_loan_payment':
                updatedFormData.sba_loan_payment = { value: numericValue, notes: card.notes };
                break;
              case 'total_debt_payments':
                updatedFormData.total_debt_payments = { value: numericValue, notes: card.notes };
                break;
              case 'projected_net_profit_margin':
                updatedFormData.projected_net_profit_margin = { value: numericValue, notes: card.notes };
                break;
              default:
                console.warn('Unhandled non-custom card:', card.id);
            }
          }
        });
    
        // Remove _id from the root level of updatedFormData
        const { _id, ...formDataWithoutId }:any = updatedFormData;
    
        // Ensure custom_cards_columns doesn't have _id
        formDataWithoutId.custom_cards_columns = formDataWithoutId.custom_cards_columns.map(({ _id, ...card }) => card);
    
        setFormData(formDataWithoutId);
        console.log('Updated form data:', formDataWithoutId);
        
        // Update the business data on the server with the entire formData, excluding _id
        await updateBusiness(id, formDataWithoutId);
        
        toast.success('Metric updated successfully!');
    
      } catch (error) {
        toast.error('Failed to update metric. Please try again.');
        console.error('Error updating metric:', error);
      }
    };
  

  const handleCardCancel = () => {
    setEditingCard(null);
  };

  const handleAddNewCard = () => {
    setIsNewCardModalOpen(true);
  };

  const handleNewCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCardData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleNewCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMetric: MetricCardData = {
      id: `custom-${Date.now()}`,
      name: newCardData.name,
      value: newCardData.value,
      metricType: newCardData.metricType,
      notes: newCardData.notes,
      isIndependent: true
    };

    try {
      const updatedMetricCards = [...metricCards, newMetric];
      setMetricCards(updatedMetricCards);

      // Create a new object without the 'id' field for the server update
      const newMetricForServer = {
        name: newMetric.name,
        value: newMetric.value,
        metricType: newMetric.metricType,
        notes: newMetric.notes,
        isIndependent: newMetric.isIndependent
      };

      const updatedFormData = {
        ...formData,
        custom_cards_columns: [...formData.custom_cards_columns, newMetricForServer]
      };

      // Remove any potential _id fields from the entire formData
      const cleanedFormData = JSON.parse(JSON.stringify(updatedFormData, (key, value) => key === '_id' ? undefined : value));

      setFormData(cleanedFormData);

      // Update the business data on the server
      await updateBusiness(id, cleanedFormData);

      setIsNewCardModalOpen(false);
      setNewCardData({
        id: '',
        name: '',
        value: 0,
        metricType: '%',
        notes: [],
        isIndependent: true
      });
      toast.success('New metric added successfully!');
    } catch (error) {
      toast.error('Failed to add new metric. Please try again.');
      console.error('Error adding new metric:', error);
    }
  };

  // Helper function to remove _id fields recursively
  const removeIdField = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(removeIdField);
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (key !== '_id') {
          newObj[key] = removeIdField(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };

  const handleDeleteCard = useCallback(async (cardId: string) => {
    try {
      // Remove the card from metricCards state
      const updatedMetricCards = metricCards.filter(card => card.id !== cardId);
      
      // Remove the card from formData.custom_cards_columns
      const updatedCustomCards = formData.custom_cards_columns.filter(card => card.id !== cardId);
      
      // Create updated formData
      const updatedFormData = {
        ...formData,
        custom_cards_columns: updatedCustomCards
      };

      // Remove _id field from the entire formData object
      const cleanedFormData = removeIdField(updatedFormData);

      // Recalculate dependent KPIs
      const recalculatedCards = calculateDependentKPIs(updatedMetricCards);

      // Update the backend first
      await updateBusiness(id, cleanedFormData);

      // If backend update is successful, update local state
      setMetricCards(recalculatedCards);
      setFormData(updatedFormData);

      toast.success('Custom metric deleted successfully');
    } catch (error) {
      console.error('Error deleting custom metric:', error);
      toast.error('Failed to delete custom metric. Please try again.');
    }
  }, [metricCards, formData, id]);
  
  

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
                <div className="w-full mt-2 text-left bg-gray-50 rounded-md p-2">
                <h4 className="text-xs font-semibold text-gray-700 mb-1">Notes:</h4>
                <ul className="list-disc list-inside">
                  {formData.business_notes.slice(0, showAllNotes ? undefined : 1).map((note, index) => (
                    <li key={index} className="text-sm text-gray-600 mb-1 break-words">{note}</li>
                  ))}
                </ul>
                {formData.business_notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShowAllNotes();
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline mt-1 focus:outline-none"
                  >
                    {showAllNotes ? "View less" : `View ${formData.business_notes.length - 1} more notes`}
                  </button>
                )}
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}

        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="metrics-grid">
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
                <Draggable key={card.id} draggableId={card.id} index={index}>
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
                          id={card.id}
                          name={card.name}
                          value={card.value}
                          metricType={card.metricType}
                          notes={card.notes}
                          isIndependent={card.isIndependent}
                          onClick={() => handleCardClick(card)}
                          onDelete={card.id && card.id.startsWith('custom-') ? () => handleDeleteCard(card.id) : undefined}
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

      {/* Edit Business Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Business Details</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.business_location}
                    onChange={(e) => setFormData({ ...formData, business_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    value={formData.business_url}
                    onChange={(e) => setFormData({ ...formData, business_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
            <h2 className="text-xl font-semibold mb-4">Edit {editingCard.name}</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleCardSave(editingCard)
            }}>
              <div className="space-y-4">
                {editingCard.isIndependent && (
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      id="value"
                      value={editingCard.value}
                      onChange={(e) => setEditingCard({ ...editingCard, value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={editingCard.notes.join('\n')}
                    onChange={(e) => setEditingCard({ ...editingCard, notes: e.target.value.split('\n') })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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


      {/* New Metric Card Modal */}
      {isNewCardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Add Financial Metric</h2>
                <button
                  onClick={() => setIsNewCardModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleNewCardSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCardData.name}
                    onChange={handleNewCardInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Value:
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={newCardData.value}
                      onChange={handleNewCardInputChange}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <div className="relative">
                      <select
                        name="metricType"
                        value={newCardData.metricType}
                        onChange={handleNewCardInputChange}
                        className="appearance-none bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="%">%</option>
                        <option value="$">$</option>
                        <option value="X">X</option>
                        <option value="N">N</option>
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Note:
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newCardData.notes.join('\n')}
                    onChange={(e) => setNewCardData({...newCardData, notes: e.target.value.split('\n')})}
                    rows={4}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


export interface MetricCardProps {
  id: string;
  name: string;
  value: number;
  metricType: '$' | 'X' | 'N' | '%';
  notes: string[];
  isIndependent: boolean;
  onClick: () => void;
  onDelete?: () => Promise<void>;  // Add this line
}

function MetricCard({
  id,
  name,
  value,
  metricType,
  notes,
  isIndependent,
  onClick,
  onDelete
}: MetricCardProps) {
  const formatValueAndColor = () => {
    let formattedValue: string
    let colorClasses: string

    switch (metricType) {
      case '$':
        formattedValue = `$${value.toLocaleString()}`
        colorClasses = 'text-purple-500'
        break
      case 'X':
        formattedValue = `${value.toFixed(2)}X`
        colorClasses = 'text-yellow-500'
        break
      case '%':
        formattedValue = `${value.toFixed(2)}%`
        colorClasses = 'text-red-500'
        break
      default:
        formattedValue = value.toFixed(2)
        colorClasses = 'text-gray-800'
    }

    return { formattedValue, colorClasses }
  }

  const { formattedValue, colorClasses } = formatValueAndColor()
  const isCustomCard = id?.startsWith('custom-') ?? false;

  return (
    <div 
      className="bg-white rounded-xl p-3 border border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 h-[110px] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xs font-medium text-gray-500 truncate">{name}</h3>
        {isCustomCard ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors duration-200"
            aria-label="Delete custom metric"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          isIndependent ? (
            <MessageSquare className="w-4 h-4 text-gray-400" />
          ) : (
            <Lock className="w-4 h-4 text-gray-400" />
          )
        )}
      </div>
      <div className="flex items-center gap-1 mb-1">
        <span className={`text-base font-semibold ${colorClasses}`}>{formattedValue}</span>
      </div>
      {notes.length > 0 && (
        <p className="text-xs pt-4 text-gray-600 truncate">{notes[0]}</p>
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



