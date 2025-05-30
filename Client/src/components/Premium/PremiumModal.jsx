import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const PremiumModal = ({ isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth0();

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCard = () => {
    return cardDetails.number.length === 16 &&
           cardDetails.expiry.length === 5 &&
           cardDetails.cvv.length === 3 &&
           cardDetails.name.length > 0;
  };

  const validateUPI = () => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  };

  const simulatePayment = async () => {
    setIsProcessing(true);
    
    try {
      const initiateResponse = await fetch('http://localhost:5000/api/premium/purchase/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          paymentMethod: paymentMethod
        })
      });

      if (!initiateResponse.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { transactionId } = await initiateResponse.json();

      await new Promise(resolve => setTimeout(resolve, 2000));

      const completeResponse = await fetch('http://localhost:5000/api/premium/purchase/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          paymentDetails: paymentMethod === 'card' ? cardDetails : { upiId }
        })
      });

      if (completeResponse.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await completeResponse.json();
        throw new Error(error.error || 'Payment failed');
      }
    } catch (error) {
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upgrade to Premium</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Premium Benefits:</h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Post unlimited properties</li>
            <li>Featured listings</li>
            <li>Priority customer support</li>
          </ul>
          <div className="mt-4 text-2xl font-bold text-blue-600">
            ₹299/month
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                paymentMethod === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              Card Payment
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg ${
                paymentMethod === 'upi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              Google Pay (UPI)
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="number"
                  maxLength="16"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={handleCardInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={cardDetails.expiry}
                    onChange={handleCardInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    maxLength="3"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={simulatePayment}
          disabled={isProcessing || (paymentMethod === 'card' ? !validateCard() : !validateUPI())}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : 'Pay ₹999'}
        </button>
      </div>
    </div>
  );
};

export default PremiumModal; 