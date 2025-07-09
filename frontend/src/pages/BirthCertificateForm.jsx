@@ .. @@
 import React, { useState } from 'react';
+import { useNavigate } from 'react-router-dom';
 import { Upload, Calendar, User, MapPin, Phone, Mail } from 'lucide-react';
+import { applicationsAPI } from '../services/api';
+import PaymentModal from '../components/PaymentModal';
 
 const BirthCertificateForm = () => {
+  const navigate = useNavigate();
+  const [loading, setLoading] = useState(false);
+  const [error, setError] = useState('');
+  const [paymentModal, setPaymentModal] = useState({ isOpen: false, application: null });
   const [formData, setFormData] = useState({
@@ .. @@
   const [ghanaCardFile, setGhanaCardFile] = useState<File | null>(null);
 
-  const handleSubmit = (e: React.FormEvent) => {
+  const handleSubmit = async (e) => {
     e.preventDefault();
-    console.log('Birth Certificate Form:', formData);
-    console.log('Ghana Card File:', ghanaCardFile);
+    setLoading(true);
+    setError('');
+
+    try {
+      const submitData = new FormData();
+      
+      // Add form data
+      Object.keys(formData).forEach(key => {
+        submitData.append(key, formData[key]);
+      });
+      
+      // Add file
+      if (ghanaCardFile) {
+        submitData.append('ghanaCard', ghanaCardFile);
+      }
+
+      const response = await applicationsAPI.submitBirthCertificate(submitData);
+      
+      if (response.data.success) {
+        // Open payment modal
+        setPaymentModal({
+          isOpen: true,
+          application: {
+            ...response.data.application,
+            userEmail: formData.contactEmail,
+            type: 'birth_certificate'
+          }
+        });
+      }
+    } catch (err) {
+      setError(err.response?.data?.message || 'Failed to submit application');
+    } finally {
+      setLoading(false);
+    }
   };

+  const handlePaymentSuccess = (paymentData) => {
+    setPaymentModal({ isOpen: false, application: null });
+    navigate('/applications', { 
+      state: { 
+        message: 'Application submitted and payment confirmed! Your application is now being processed.' 
+      }
+    });
+  };
+
   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
@@ .. @@
               <div className="flex justify-center">
                 <button
                   type="submit"
-                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
+                  disabled={loading}
+                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
-                  Submit Birth Certificate Application
+                  {loading ? 'Submitting...' : 'Submit Birth Certificate Application'}
                 </button>
               </div>
+
+              {error && (
+                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
+                  <p className="text-red-800">{error}</p>
+                </div>
+              )}
             </form>
           </div>
+
+          <PaymentModal
+            isOpen={paymentModal.isOpen}
+            onClose={() => setPaymentModal({ isOpen: false, application: null })}
+            application={paymentModal.application}
+            onPaymentSuccess={handlePaymentSuccess}
+          />
         </div>
       </div>
     </div>