import showToast from '@/api/lib/showToast';
import { BackendUser, getUserById } from '@/api/services/base.service';
import { sendNotification } from '@/api/services/notify.service';
import { toggleTicketStatus } from '@/api/services/qr-ticket.service';
import { getQrByValue } from '@/api/services/qr.service';
import { QrTicketType } from '@/app/admin/ticket/ticket-table/page';
import { QrCode } from '@/types/qrCode';
import React, { useEffect, useRef, useState } from 'react'

type ModalProps = {
  popupClassName?: string;
  isOpen: boolean;
  selected: QrTicketType | null;
  setSelected: React.Dispatch<React.SetStateAction<null | QrTicketType>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTickets: React.Dispatch<React.SetStateAction<QrTicketType[]>>;
};

export default function Modal({popupClassName='', selected,setSelected,isOpen,setIsOpen,setTickets}:ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [qr,setQr]=useState<QrCode | null>(null)
  const [user, setUser] = useState<BackendUser | null>(null);
  const [scannedByUser, setScannedByUser] = useState<BackendUser | null>(null);
  const [adminResTitle,setAdminResTitle]=useState<string>("Ticket Issue Resolved.")
  const [adminResMsg, setAdminResMsg] = useState<string>("");
  const [submitting,setSubmitting]=useState<boolean>(false)
  const [errors, setErrors] = useState({
    adminResMsg: "",
    adminResTitle: "",
  });

  const onCancel = ()=>{
    setIsOpen(false)
    setSelected(null)
  }

   const handleStatus = async ()=>{
            try{
                  const res = await toggleTicketStatus(selected?.id ?? '')
                  setIsOpen(false)
                  setTickets((prev) =>{
                    const updated = prev.map((ticket) =>
                    ticket.id === selected?.id
                        ? { ...ticket, status: false }
                        : ticket
                    );

                    updated.sort((a, b) => {
                      if (a.status === b.status) return 0;
                      return a.status ? -1 : 1; 
                    });
                    return updated;
                  });
                 setSelected(null);
                  console.log(res,'ts')
                }catch(err){
                  console.log(err)
                }
        }
  
    const sendNotificationFn = async ()=>{
          if(user){
          try {
            const res = await sendNotification({
              userId: user?.id ?? '',
              title: adminResTitle,
              message: adminResMsg
            });
            console.log(res, "ts");
          } catch (err) {
            console.log(err);
          }
        }else{
          showToast(false,'Concerned person not found.')
        }}
      
  const onRespond = async () => {
          if (!selected) {
            showToast(false, "Ticket not found");
            return;
          }

          if(!adminResMsg.trim()){
            setErrors((p)=>({...p,adminResMsg:'Please provide message'}))
            showToast(false,'Provide response in admin response.')
            return;
          }

          setSubmitting(true);

          try {
            await handleStatus(); 
            await sendNotificationFn(); 
            setAdminResMsg('')
            setAdminResTitle("Ticket Issue Resolved.");
            setErrors({
                adminResMsg: "",
                adminResTitle: "",
            })
            showToast(true, "Response submitted successfully.");
            onCancel();

          } catch (err) {
            console.log(err);
            showToast(false, "Something went wrong while responding.");
          } finally {
            setSubmitting(false);
          }
    };


  useEffect(()=>{
    const fetchScannedByUser = async ()=>{
      const userId = typeof qr?.scanned_by == 'string' ? qr?.scanned_by : qr?.scanned_by?.id
      if(!userId){
        return;
      }
      try{
        const res = await getUserById(userId ?? '')
        setScannedByUser(res)
        console.log(res)
      }catch(err){
        console.log(err,'err')
      }
    }
    if(qr){
      fetchScannedByUser()
    }
  },[qr])

  useEffect(()=>{
    const fetchTicket = async()=>{
      try{
        const res = await getQrByValue(selected?.qrValue || '')
        setQr(res)
      }catch(e){
        console.log(e)
      }
    }

    const fetchUser = async () => {
       try {
         const res = await getUserById(selected?.userId || "");
         setUser(res)
       } catch (e) {
         console.log(e);
       }
     };

    if(!selected)return;
    else{
      fetchTicket()
      fetchUser()
    }
  },[selected])

  useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        window.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, setIsOpen]);
    

  if(!isOpen)return null;  

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/10 backdrop-blur-lg">
      <div
        ref={modalRef}
        className={`p-4 px-2 md:p-6 flex flex-col rounded-xl shadow-xl border border-primary bg-white w-[90%] h-[90%] md:w-[85%] md:h-[90%] max-h-[800px] ${popupClassName}`}
      >
        <div className="pl-4 flex justify-between items-center mb-2 md:mb-2">
          <h2 className="text-lg text-primary tracking-wide font-semibold">
            Verify Ticket
          </h2>
          <button
            className="rounded-full flex justify-center items-center text-white font-semibold w-8 h-8 p-2 bg-primary hover:bg-hoverPrimary"
            onClick={onCancel}
          >
            ✕
          </button>
        </div>

        <div className="w-full flex flex-col gap-6 overflow-y-auto max-h-[90%] flex-1 pb-6 md:pb-8 p-4">
          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* QR Details */}
            <div className="w-full md:w-[50%] border rounded-lg p-4 shadow-sm">
              <h3 className="text-primary/90 font-semibold mb-2">QR Details</h3>
              {!qr ? (
                <p className="text-gray-500 text-sm">Loading QR info...</p>
              ) : (
                <div className="space-y-2 text-sm">
                  {qr.scanned_by && (
                    <div className="md:p-2 md:px-4 pb-2 md:mb-4 border-b md:border md:rounded-md space-y-2 md:shadow-sm">
                      <p className="">
                        <strong>Scanned By:</strong>{" "}
                        {scannedByUser
                          ? scannedByUser.name
                          : "User Info not found"}
                      </p>
                      {scannedByUser && (
                        <div className="space-y-1 text-sm mt-2">
                          <p>
                            <strong>Email:</strong>{" "}
                            {scannedByUser.email || "Not Found"}
                          </p>
                          <p>
                            <strong>Phone:</strong>{" "}
                            {scannedByUser.phone || "Not Found"}
                          </p>
                          <p>
                            <strong>User Type:</strong>{" "}
                            {scannedByUser.userType || "Not Found"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <p>
                    <strong>Reward Amount:</strong> ₹{qr.reward_amount}
                  </p>

                  <p>
                    <strong>Scanned At:</strong>{" "}
                    {qr.scanned_at
                      ? new Date(qr.scanned_at).toLocaleString()
                      : "Not Yet Scanned"}
                  </p>
                  <p>
                    <strong>Redeemed At:</strong>{" "}
                    {qr.redeemed_at
                      ? new Date(qr.redeemed_at).toLocaleString()
                      : "Not Yet Redeemed"}
                  </p>

                  <p>
                    <strong>Expiry:</strong>{" "}
                    {new Date(qr.couponcode_expiry).toLocaleString()}
                  </p>

                  <p>
                    <strong>QR Value:</strong> {qr.qr_value}
                  </p>
                  <p>
                    <strong>Batch No:</strong> {qr.batch_no}
                  </p>
                </div>
              )}
            </div>
            <div className="w-full md:w-[50%] flex flex-col border rounded-lg p-4 shadow-sm">
              <h3 className="text-primary/90 font-semibold mb-2 ">
                Ticket Info
              </h3>
              <p className="text-sm text-primary">
                <strong>Title:</strong> {selected?.title || "Not Found"}
              </p>
              <p className="text-sm text-primary mt-2">
                <strong>Description:</strong>{" "}
                {selected?.description || "Not Found"}
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4">
            {/* User Details */}
            <div className="w-full md:w-[50%] border rounded-lg p-4 shadow-sm">
              <h3 className="text-primary/90 font-semibold mb-2">
                User Details
              </h3>
              {!user ? (
                <p className="text-gray-500 text-sm">Loading user info...</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>User Type:</strong> {user.userType}
                  </p>
                  {user?.userType == "carpenter" && (
                    <p>
                      <strong>Verified:</strong>{" "}
                      {user.isVerified ? "Yes" : "No"}
                    </p>
                  )}
                  <p>
                    <strong>Active:</strong> {user.is_active ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Admin Response Inputs */}
            <div className="w-full md:w-[50%] border rounded-lg p-4 shadow-sm">
              <h3 className="text-primary/90 font-semibold mb-2">
                Admin Response
              </h3>

              <label className="block mb-2 text-sm text-gray-600">
                Title
                <input
                  type="text"
                  value={adminResTitle}
                  onChange={(e) => {
                    if (errors.adminResMsg.trim()) {
                      setErrors((p) => ({ ...p, adminResMsg: "" }));
                    }
                    setAdminResTitle(e.target.value);
                    return;
                  }}
                  className="w-full mt-1 border text-primary rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-primary"
                  placeholder="Enter notification title"
                />
              </label>

              <label className="block text-sm text-gray-600">
                Message
                <textarea
                  value={adminResMsg}
                  onChange={(e) =>{
                    if (errors.adminResMsg.trim()) {
                      setErrors((p) => ({ ...p, adminResMsg: "" }));
                    }
                    setAdminResMsg(e.target.value)}
                  }
                  rows={3}
                  className="w-full mt-1 border text-primary rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-primary"
                  placeholder="Write message to user"
                />
              </label>
              {errors.adminResMsg && (
                <p className="text-red-400  my-1 text-sm font-medium">
                  {errors.adminResMsg}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t-2 border-primary pt-4 gap-4">
          <button
            disabled={submitting}
            onClick={onCancel}
            className={`px-4 md:px-6 py-2 cursor-pointer text-primary border-primary border-2  bg-[#EEE6EC] rounded-md ${
              submitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-hoverSecondary"
            }`}
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={() => {
              onRespond();
            }}
            className={`px-4 md:px-6 cursor-pointer py-2 text-white hover:bg-hoverPrimary rounded-md ${
              submitting ? "bg-primary/50 cursor-not-allowed" : "bg-primary"
            }`}
          >
            {submitting ? "Responding.." : "Respond"}
          </button>
        </div>
      </div>
    </div>
  );
}
