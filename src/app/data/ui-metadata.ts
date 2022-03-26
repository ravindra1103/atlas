import { CommonConstants } from '../shared/constants';
import { InputForm, RecordInput, SingleSectionTab } from '../shared/interfaces';

const getInputFormsLtr = () => {
  const inputForms: InputForm[] = [
    {
      label: 'Step 1',
      inputRecordsToAccept: [
        {
          type: CommonConstants.numberType,
          label: 'FICO',
          isMandatory: true,
          keyToRead: 'fico'
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Loan Purpose',
          isMandatory: true,
          valueToBind: ['Purchase', 'Delayed Purchase', 'Rate/Term', 'Cash Out'],
          selectedValueToBind: 'Purchase',
          keyToRead: 'loan_purpose'
        },
        {
          type: CommonConstants.numberType,
          label: 'Experience',
          isMandatory: true,
          infoMessage: 'No. properties currently under management',
          keyToRead: 'experience'
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Property Type',
          isMandatory: false,
          valueToBind: ['SFR', 'Condo', '2-4 Unit', '5+ Units'],
          selectedValueToBind: 'SFR',
          keyToRead: 'property_type'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Appraised Value',
          isMandatory: true,
          keyToRead: 'appraised_value'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Purchase Price',
          isMandatory: false,
          keyToRead: 'purchase_price'
        },
        {
          type: CommonConstants.numberType,
          label: 'No. Units',
          isMandatory: false,
          keyToRead: 'number_of_units'
        },
        {
          type: CommonConstants.numberType,
          label: 'Zip Code',
          isMandatory: false,
          keyToRead: 'zip_code'
        },
        {
          type: CommonConstants.textType,
          label: 'Acquisition Date',
          isMandatory: false,
          keyToRead: 'acquisition_date'
        },
      ] as RecordInput[],
    },
    {
      label: 'Step 2',
      disabledDiv: false,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Loan Amount',
          isMandatory: false,
          keyToRead: 'loan_amount'
        },
        {
          type: CommonConstants.dropdownType,
          label: 'PPP Type',
          isMandatory: true,
          valueToBind: ['Hard', 'Declining', '1%'],
          infoMessage: 'The penalty is the same all years',
          selectedValueToBind: 'Hard',
          keyToRead: 'ppp_type'
        },
        {
          type: CommonConstants.dropdownType,
          label: 'PPP Term',
          isMandatory: true,
          valueToBind: [
            '60 Mos.',
            '48 Mos.',
            '36 Mos.',
            '24 Mos.',
            '12 Mos.',
            'No PPP',
          ],
          selectedValueToBind: '60 Mos.',
          keyToRead: 'ppp_term'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Taxes',
          isMandatory: true,
          keyToRead: 'annual_taxes'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual HOI',
          isMandatory: true,
          keyToRead: 'annual_hoi'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Other',
          isMandatory: false,
          infoMessage: 'HOA, Flood, Management Fees',
          keyToRead: 'annual_other'
        },
        {
          type: CommonConstants.numberType,
          label: 'Orig. Pts',
          isMandatory: false,
          keyToRead: 'origination_points'
        },
        {
          type: CommonConstants.numberType,
          label: 'Broker Pts',
          isMandatory: false,
          keyToRead: 'broker_points'
        },
        {
          type: CommonConstants.currencyType,
          label: 'Other Costs',
          isMandatory: false,
          infoMessage:
            '$1,250 Processing & Underwriting + est. $2,500 other fees + est. 1% for title',
          keyToRead: 'other_costs'
        },
      ] as RecordInput[],
    },
    {
      label: 'Property Economics',
      disabledDiv: false,
      twoColumnLayout: true,
      showUnits: true,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Market Rent',
          isMandatory: false,
          keyToRead: 'market_rent'
        },
        {
          type: CommonConstants.currencyType,
          label: 'In-Place Rent',
          isMandatory: false,
          keyToRead: 'in_place_rent'
        },
        {
          type: CommonConstants.numberType,
          label: 'Sq Ft',
          isMandatory: false,
          keyToRead: 'sq_ft'
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Lease Type',
          isMandatory: false,
          keyToRead: 'lease_type',
          valueToBind: ['Long Term'],
          selectedValueToBind: 'Long Term'
        },
      ] as RecordInput[],
    },
  ];
  return inputForms;
};

const getInputFormsBridge = () => {
  const inputForms: InputForm[] = [
    {
      label: 'Step 1',
      inputRecordsToAccept: [
        {
          type: CommonConstants.numberType,
          label: 'FICO',
          isMandatory: true,
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Loan Purpose',
          isMandatory: true,
          valueToBind: ['Purchase', 'Delayed Purchase', 'Cash Out'],
          selectedValueToBind: 'Purchase',
        },
        {
          type: CommonConstants.numberType,
          label: 'Experience',
          isMandatory: true,
          infoMessage: 'No. properties currently under management',
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Property Type',
          isMandatory: false,
          valueToBind: ['SFR', 'Condo', '2-4 Unit', '5+ Units'],
          selectedValueToBind: 'SFR',
        },
        {
          type: CommonConstants.currencyType,
          label: 'Appraised Value',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Purchase Price',
          isMandatory: false,
        },
        {
          type: CommonConstants.textType,
          label: 'Acquisition Date',
          isMandatory: false,
        },
      ] as RecordInput[],
    },
    {
      label: 'Step 2',
      disabledDiv: false,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Loan Amount',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'No. Units',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Zip Code',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Taxes',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual HOI',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Other',
          isMandatory: false,
          infoMessage: 'HOA, Flood, Management Fees',
        },
        {
          type: CommonConstants.numberType,
          label: 'Orig. Pts',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Broker Pts',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Other Costs',
          isMandatory: false,
          infoMessage:
            '$1,250 Processing & Underwriting + est. $2,500 other fees + est. 1% for title',
        },
      ] as RecordInput[],
    },
    {
      label: 'Property Economics',
      disabledDiv: false,
      twoColumnLayout: true,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Market Rent',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'In-Place Rent',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Sq Ft',
          isMandatory: false,
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Lease Type',
          isMandatory: false,
        },
      ] as RecordInput[],
    },
  ];
  return inputForms;
};

const getRehab = () => {
  const inputForms: InputForm[] = [
    {
      label: 'Step 1',
      inputRecordsToAccept: [
        {
          type: CommonConstants.numberType,
          label: 'FICO',
          isMandatory: true,
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Loan Purpose',
          isMandatory: true,
          valueToBind: ['Purchase', 'Delayed Purchase', 'Cash Out'],
          selectedValueToBind: 'Purchase',
        },
        {
          type: CommonConstants.numberType,
          label: 'Experience',
          isMandatory: true,
          infoMessage: 'No. properties currently under management',
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Property Type',
          isMandatory: false,
          valueToBind: ['SFR', 'Condo', '2-4 Unit', '5+ Units'],
          selectedValueToBind: 'SFR',
        },
        {
          type: CommonConstants.currencyType,
          label: 'Appraised Value',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Purchase Price',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Rehab Amount',
          isMandatory: false,
        },
        {
          type: CommonConstants.textType,
          label: 'ARV',
          isMandatory: false,
        },
        {
          type: CommonConstants.textType,
          label: 'Acquisition Date',
          isMandatory: false,
        },
      ] as RecordInput[],
    },
    {
      label: 'Step 2',
      disabledDiv: false,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Loan Amount',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'No. Units',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Zip Code',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Taxes',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual HOI',
          isMandatory: true,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Annual Other',
          isMandatory: false,
          infoMessage: 'HOA, Flood, Management Fees',
        },
        {
          type: CommonConstants.numberType,
          label: 'Orig. Pts',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Broker Pts',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'Other Costs',
          isMandatory: false,
          infoMessage:
            '$1,250 Processing & Underwriting + est. $2,500 other fees + est. 1% for title',
        },
      ] as RecordInput[],
    },
    {
      label: 'Property Economics',
      disabledDiv: false,
      twoColumnLayout: true,
      inputRecordsToAccept: [
        {
          type: CommonConstants.currencyType,
          label: 'Market Rent',
          isMandatory: false,
        },
        {
          type: CommonConstants.currencyType,
          label: 'In-Place Rent',
          isMandatory: false,
        },
        {
          type: CommonConstants.numberType,
          label: 'Sq Ft',
          isMandatory: false,
        },
        {
          type: CommonConstants.dropdownType,
          label: 'Lease Type',
          isMandatory: false,
        },
      ] as RecordInput[],
    },
  ];
  return inputForms;
};

export const data = [
  {
    inputFormsToAccept: getInputFormsLtr(),
    singleSectionName: { key: 'ltr', labelValue: 'LTR' },
  },
  {
    inputFormsToAccept: getInputFormsBridge(),
    singleSectionName: { key: 'bridgeLoan', labelValue: 'Bridge Loan' },
  },
  {
    inputFormsToAccept: getRehab(),
    singleSectionName: { key: 'rehab', labelValue: 'Rehab' },
  },
] as SingleSectionTab[];
