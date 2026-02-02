import { useState } from "react";

function PersonalInfoModal() {
  const [open, setOpen]= useState(false);

  const data = {
    surname: "DELA CRUZ",
    firstName: "JUAN",
    middleName: "SANTOS",
    tin: "123-456-789",
    address: "123 Mabini Street, Manila",
    citizenship: "Filipino",
    placeOfBirth: "Manila",
    sex: "Male",
    civilStatus: "Single",
    dateOfBirth: "1998-06-15",
    height: "170 cm",
    weight: "65 kg",
  };

  return (
    <>
    <button onClick={()=>setOpen(true)}>View</button>

    {open ?<>  <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={()=>setOpen(false)}
      />


      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-black w-full max-w-6xl text-[12px] font-sans">

          <div className="flex items-center justify-between border-b border-black px-3 py-2">
            <h2 className="font-bold text-sm">Personal Information</h2>
            <button
              onClick={()=>setOpen(false)}
              className="text-lg leading-none hover:text-red-600"
            >
              ✕
            </button>
          </div>


          <div className="p-3">

            <div className="flex gap-1 mb-1">
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">NAME (SURNAME)</p>
                <p>{data.surname}</p>
              </div>
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">(FIRST)</p>
                <p>{data.firstName}</p>
              </div>
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">(MIDDLE)</p>
                <p>{data.middleName}</p>
              </div>
              <div className="w-48 border border-black p-1">
                <p className="text-[10px] font-bold">TIN (if any)</p>
                <p>{data.tin}</p>
              </div>
            </div>


            <div className="border border-black p-1 mb-1">
              <p className="text-[10px] font-bold">ADDRESS</p>
              <p>{data.address}</p>
            </div>


            <div className="flex gap-1 mb-1">
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">CITIZENSHIP</p>
                <p>{data.citizenship}</p>
              </div>
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">PLACE OF BIRTH</p>
                <p>{data.placeOfBirth}</p>
              </div>
              <div className="w-48 border border-black p-1">
                <p className="text-[10px] font-bold">SEX</p>
                <div className="flex flex-col text-[11px]">
                  <span className={data.sex === "Male" ? "font-bold" : ""}>☑ Male</span>
                  <span className={data.sex === "Female" ? "font-bold" : ""}>☑ Female</span>
                </div>
              </div>
            </div>


            <div className="flex gap-1">
              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">CIVIL STATUS</p>
                <div className="grid grid-cols-2 text-[11px]">
                  {["Single", "Married", "Widowed", "Divorced"].map(status => (
                    <span
                      key={status}
                      className={data.civilStatus === status ? "font-bold" : ""}
                    >
                      ☑ {status}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 border border-black p-1">
                <p className="text-[10px] font-bold">DATE OF BIRTH</p>
                <p>{data.dateOfBirth}</p>
              </div>

              <div className="w-32 border border-black p-1">
                <p className="text-[10px] font-bold">HEIGHT</p>
                <p>{data.height}</p>
              </div>

              <div className="w-32 border border-black p-1">
                <p className="text-[10px] font-bold">WEIGHT</p>
                <p>{data.weight}</p>
              </div>
            </div>
          </div>
        </div>
      </div></> :''}
    </>
  );
}
export default PersonalInfoModal