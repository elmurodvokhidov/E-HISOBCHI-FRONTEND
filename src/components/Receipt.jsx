import { IoCloseOutline } from "react-icons/io5";
import { FormattedDate } from "./FormattedDate";
import { FormattedTime } from "./FormattedTime";
import logo from "../assets/images/UITC 1.png";
import ReactToPrint from "react-to-print";
import { useRef } from "react";

export default function Receipt({
  modals,
  closeModal,
  payment,
  student,
}) {
  const receiptRef = useRef();

  return (
    <div
      onClick={() => closeModal()}
      className="w-full h-screen flex items-center justify-center fixed top-0 left-0 z-20"
      style={{ background: "rgba(0, 0, 0, 0.650)", opacity: modals.receiptModal ? "1" : "0", zIndex: modals.receiptModal ? "20" : "-1" }}>
      <div onClick={(e) => e.stopPropagation()} className="w-[500px] shadow-dim bg-white">
        <div className="flex justify-between items-center text-xl px-4 pt-4 pb-2 border-b-2">
          <h1>Kvitansiya</h1>
          <button
            type="button"
            onClick={() => closeModal()}
            className="text-gray-500 hover:text-black transition-all duration-300">
            <IoCloseOutline />
          </button>
        </div>

        <div className="w-full flex flex-col gap-6 items-center py-6">
          <div ref={receiptRef} className="w-72 p-5 border border-gray-300 rounded-lg shadow-dim bg-white">
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
              <img
                crossOrigin="anonymous"
                src={logo}
                alt="company logo "
                className="w-24 h-auto mx-auto mb-2"
              />
            </div>
            <div>
              <p><strong>Tekshirish raqami:</strong> <span>№{payment?.verification}</span></p>
              <p><strong>Kompaniya:</strong> <span className="uppercase">{payment?.company}</span></p>
              <p><strong>Talaba:</strong> <span className="capitalize">{student?.first_name + " " + student?.last_name}</span></p>
              <p><strong>Telefon:</strong> {student?.phoneNumber}</p>
              <p><strong>Guruh:</strong> {student?.group?.course?.title}</p>
              <p><strong>Kurs narxi:</strong> {student?.group?.course?.price?.toLocaleString()} UZS</p>
              <p><strong>O'qituvchi:</strong> <span className="uppercase">{student?.group?.teacher?.first_name + " " + student?.group?.teacher?.last_name}</span></p>
              <p><strong>Turi:</strong> {payment?.method === "cash" ? "Naqd pul" : payment?.method === "card" ? "Plastik" : "-"}</p>
              <p><strong>To'lov miqdori:</strong> {payment?.amount?.toLocaleString()} UZS</p>
              <p><strong>Sana:</strong> <FormattedDate date={payment?.date} /></p>
            </div>
            <div className="border-t border-gray-300 pt-4 mt-4">
              <p><strong>Xodim:</strong> <span className="capitalize">{payment?.author ? payment?.author?.first_name + " " + payment?.author?.last_name : "Tizim"}</span></p>
              <p><strong>Vaqt:</strong> <FormattedDate date={payment?.createdAt} /> <FormattedTime date={payment?.createdAt} /></p>
            </div>
          </div>

          <ReactToPrint
            trigger={() => <button className="w-32 h-10 rounded-3xl bg-main-1">Chop etish</button>}
            content={() => receiptRef.current}
          />
        </div>
      </div>
    </div>
  )
}
