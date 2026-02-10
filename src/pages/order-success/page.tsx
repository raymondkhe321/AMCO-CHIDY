import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const method = searchParams.get('method');
  const [isVerifying, setIsVerifying] = useState(method !== 'bank');
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    if (method === 'bank') {
      setVerificationStatus('success');
      return;
    }

    if (!reference) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/verify-paystack-payment`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ reference }),
          }
        );

        const data = await response.json();

        if (data.success && data.paymentStatus === 'paid') {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('failed');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [reference, method, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <i className="ri-loader-4-line text-7xl text-amber-600 animate-spin mb-6"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-close-line text-4xl text-red-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-8">
              We couldn&apos;t verify your payment. Please contact support if you were charged.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-4xl text-green-600"></i>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {method === 'bank' ? 'Order Received!' : 'Payment Successful!'}
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order
          </p>
          
          {reference && (
            <p className="text-sm text-gray-500 mb-8">
              Order Reference: <span className="font-mono font-semibold">{reference}</span>
            </p>
          )}

          {method === 'bank' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <i className="ri-bank-line text-xl text-amber-600 mr-2"></i>
                Bank Transfer Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span className="font-semibold text-gray-900">Access Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-semibold text-gray-900">AMCO Electrical Materials</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-semibold text-gray-900">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-semibold text-amber-600">{reference}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4 bg-white p-3 rounded-lg">
                <i className="ri-information-line mr-1"></i>
                Please include the reference number when making your transfer. Your order will be processed once payment is confirmed.
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">What&apos;s Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-mail-line text-amber-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-600">You&apos;ll receive an email confirmation shortly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-box-3-line text-amber-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Processing</p>
                  <p className="text-sm text-gray-600">We&apos;ll prepare your items for delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-truck-line text-amber-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-sm text-gray-600">Your order will be delivered to your address</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/products')}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
