import { useContext, useReducer } from "react"
import  { AnnouncementContext }  from "../announcementList";

const initialState ={
  activeId: null,
  create: {title : "", body : ""},
  edit: {id: "", title : "", body: ""},
  feedback:{create:'', edit:'', remove:''},
  error:{create:'', edit:'', remove:''}
}

const reducer = (state, action) =>{
  switch(action.type){
    case 'SET_ACTIVE':
      return {
        ...state,
        activeId: action.payload?.id || null,
        edit: action.payload ?{...action.payload}  : {id: "", title : "", body: ""},
        feedback:{create:'', edit:'', remove:''}, error:{create:'', edit: '', remove:''}
      }
    case 'UPDATE_CREATE':
      return{
        ...state, create: {...state.create, ...action.payload}
      }
    case 'UPDATE_EDIT':
      return{
        ...state, edit: {...state.edit, ...action.payload}
      }
    case 'CREATE_SUCCESS':
      return{
        ...state,
        create: {title : "", body : ""},
        feedback: {...state.feedback, create: action.payload},
        error: {...state.error, create: ''}
      }
      case 'EDIT_SUCCESS':
        return{
          ...state,
          feedback:{...state.feedback, edit: action.payload},
          error:{...state.error, edit: ''}
        }
      case 'REMOVE_SUCCESS':
        return{
          ...state,
          activeId: null,
          edit: {id: "", title : "", body: ""},
          feedback:{...state.feedback, remove: action.payload},
          error:{...state.error, remove: ''}
        }
      case 'SET_ERROR':
        return{
          ...state,
          feedback:{create:'', edit:'', remove:''},
          error:{...state.error, [action.payload.type]: action.payload.message}
        }
  }
}
function Announcement(){
  const {announcement, message, setMessage} =useContext(AnnouncementContext);
  const [state, dispatch] = useReducer(reducer, initialState);
 
  const handleClick =async ()=>{
    const formData = new FormData();
    formData.append("action", "create");
    formData.append("title", state.create.title);
    formData.append("body", state.create.body);

    const res =await fetch("http://localhost/digibaranggay/announcement.php",{
      method : "POST",
      body: formData
    })
    const data = await res.json();
    if(data.success){
      dispatch({type: 'CREATE_SUCCESS', payload: data.message})
    }else{
      dispatch({type: 'SET_ERROR', payload: {type:'create', message: data.message}})
    }
  }
  
const HandleRemoveClick = async()=>{
    const formData = new FormData();
    formData.append('action', 'remove');
    formData.append('id', state.edit.id);
    const res = await fetch("http://localhost/digibaranggay/announcement.php",{
    method : "POST",
    body : formData
    })
    const data = await res.json();
    if(data.success){
      dispatch({type:'REMOVE_SUCCESS', payload: data.message})
    }else{
      dispatch({type: 'SET_ERROR', payload: {type: 'remove', message: data.message}})
    }
}
   

  const handleEditClick = async()=>{
    const formData = new FormData();
    formData.append('action', 'edit');
    formData.append('id', state.edit.id);
    formData.append('title', state.edit.title);
    formData.append('body', state.edit.body);

    const res = await fetch("http://localhost/digibaranggay/announcement.php",{
    method : "POST",
    body : formData
    })
    const data = await res.json();
    if(data.success){
      dispatch({type: 'EDIT_SUCCESS', payload: data.message})
      
    }else{
      dispatch({type: 'SET_ERROR', payload: {type:'edit', message: data.message}})
    }
  }
  const isEditing = state.activeId;

  return (
  <div className="announcement-div">
    <div className="existing-announcement no-scrollbar">
      {message && <p className="text-rose-600">{message}</p>}
      {announcement.map(a => {
        const isActive = state.activeId === a.id;

        return (
          <div key={a.id} className={`ann-title-date`}>
            <div
              className="ann cursor-pointer" onClick={()=>dispatch({type: 'SET_ACTIVE', payload: isActive ? null : a})}>
              <div>
                <h3 className="text-lg font-semibold ">
                  {a.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {a.date}
                </p>
              </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${
                isActive ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
              <p className="text-base leading-relaxed text-gray-800">
                {a.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>

    {isEditing
    ? <div className="make-announcement space-y-8 ">
      <div><h2 className="  font-semibold text-3xl">Edit {state.edit.title}</h2></div>
      <div className="flex flex-col">
        <label className="text-gray-800  font-medium">Title</label>
        <input type="text" className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2
         focus:outline-none focus:ring-2 focus:ring-teal-600" value={state.edit.title} 
         onChange={(e)=>dispatch({type: 'UPDATE_EDIT', payload: {title: e.target.value}})}/>
      </div>
      <div className="flex flex-col">
        <label className="text-gray-800  font-medium">Body</label>
        <textarea value={state.edit.body} 
        onChange={(e)=>dispatch({type:'UPDATE_EDIT', payload: {body: e.target.value}})} className="bg-gray-100 border border-gray-300 rounded-lg p-3 h-40 resize-none
           focus:outline-none focus:ring-2 focus:ring-teal-600" />
      </div>
      <div className="space-x-5">
        <button
        className="bg-emerald-700 text-white px-8 py-2 rounded-lg hover:bg-emerald-800 transition-all duration-200
         active:scale-95" onClick={()=>handleEditClick()}> Edit Announcement
      </button>
      <button className="bg-rose-600 text-white px-8 py-2 rounded-lg hover:bg-rose-700 transition-all duration-200
      active:scale-95" onClick={()=>HandleRemoveClick()}>
        Remove this announcement
      </button>
      {state.feedback.remove && <div className="primary-color-text font-semibold text-sm">{state.feedback.remove}</div>}
      {state.error.remove && <div className="text-rose-600 font-semibold text-sm">{state.error.remove}</div>}
      {state.feedback.edit && <div className="primary-color-text font-semibold text-sm">{state.feedback.edit}</div>}
      {state.error.edit && <div className="text-rose-600 font-semibold text-sm">{state.error.edit}</div>}
      </div>
     </div> 
      
      : <div className="make-announcement max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-semibold text-black mb-6">
      Create Announcement
      </h2>

      <div className="space-y-5 text-gray-700">
    
        <div className="flex flex-col gap-2">
        <label className="text-gray-700  font-medium">
        Announcement Title
        </label>
        <input type="text" placeholder="Enter title..." value={state.create.title}
        className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2
         focus:outline-none focus:ring-2 focus:ring-teal-600"
         onChange={(e)=>dispatch({type:'UPDATE_CREATE', payload:{title: e.target.value}})}/>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-700  font-medium"> Announcement Body</label>

        <textarea placeholder="Write your announcement here..." value={state.create.body}
          className="bg-gray-100 border border-gray-300 rounded-lg p-3 h-40 resize-none
           focus:outline-none focus:ring-2 focus:ring-teal-600" 
           onChange={(e)=>dispatch({type: 'UPDATE_CREATE', payload: {body: e.target.value}})} />
      </div>

    <div className="flex items-center gap-4 pt-4">
      <button
        className="bg-emerald-700 text-white px-8 py-2 rounded-lg hover:bg-emerald-800 transition-all duration-200
         active:scale-95" onClick={()=>handleClick()}> Post Announcement
      </button>
      {state.feedback.create && <div className="primary-color-text font-semibold text-sm">{state.feedback.create}</div>}
      {state.error.create && <div className="text-rose-600 font-semibold text-sm">{state.error.create }</div>}
    </div>
  </div>
</div>}

  </div>
);

}
export default Announcement