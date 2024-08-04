import React from 'react'
import { useRef, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';



const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    console.log(passwords);
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      toast('Failed to copy text', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const showPassword = () => {
    if (passwordRef.current.type === "password") {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "password";
    }
  };

  
  const savePassword = async () => {
    // Validate input length
    if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
      const newPassword = { ...form, id: uuidv4() };

      try {
        // Update state with new password
        setPasswordArray([...passwordArray, newPassword]);

        // Save password to backend
        await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPassword)
        });

        // Clear form fields
        setForm({ site: "", username: "", password: "" });

        // Notify user of success
        toast('Password saved!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (error) {
        console.error('Failed to save password:', error);
        toast('Error: Password not saved!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      toast('Please fill in all fields correctly.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };



  const deletePassword = async (id) => {
    console.log("Deleting password with id ", id);
    const c = confirm("Do you really want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter(item => item.id !== id));
      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      toast('Password deleted!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const editPassword = (id) => {
    console.log("Editing password with id", id);
    const selectedPassword = passwordArray.find(i => i.id === id);
    setForm(selectedPassword);
    setPasswordArray(passwordArray.filter(item => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="Bounce"
      />

      <div className="absolute top-0 z-[-2] h-screen w-screen bg-green-50 bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

      <div className="p-3 md:mycontainer min-h-[88.2vh]">
        <h1 className='text-4xl font-bold text-center'>
          <span className='text-green-700'>&lt;</span>
          <span>Pass</span><span className='text-green-500'>OP/ &gt;</span>
        </h1>
        <p className='text-green-900 text-lg text-center'>Your own password Manager</p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input value={form.site} onChange={handleChange} placeholder='Enter your website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='site' id='site' />
          <div className="flex flex-col w-full justify-between gap-8">
            <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='username' id='username' />
            <div className="relative">
              <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name='password' id='password' />
              <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                <img ref={ref} className='p-1' width={30} src="icons/eye.png" alt="eye" />
              </span>
            </div>
          </div>
        </div>
        <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-600 hover:bg-green-200 rounded-full px-8 py-2 w-fit mx-auto border-2 border-green-900'>
          <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
          Save
        </button>

        <div className="passwords">
          <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
          {passwordArray.length === 0 && <div>No password to show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className='bg-green-800 text-white'>
                <tr>
                  <th className='py-2'>Site</th>
                  <th className='py-2'>Username</th>
                  <th className='py-2'>Password</th>
                  <th className='py-2'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-green-100'>
                {passwordArray.map((item, index) => (
                  <tr key={index}>
                    <td className='py-2 border border-white text-center'>
                      <div className='flex items-center justify-center'>
                        <a href={item.site} target='_blank' rel="noopener noreferrer">{item.site}</a>
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                          <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='justify-center py-2 border border-white text-center'>
                      <div className="flex items-center justify-center">
                        {item.username}
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.username)}>
                          <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='items-center py-2 border border-white text-center'>
                      <div className="flex items-center justify-center">

                        {/* To hide password in table : */}
                        {/* <span>{"*".repeat(item.password.length)}</span> */}
                        {/* To show password in table: */}
                        <span>{item.password}</span>
                        
                        <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.password)}>
                          <lord-icon style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }} src="https://cdn.lordicon.com/iykgtsbt.json" trigger="hover"></lord-icon>
                        </div>
                      </div>
                    </td>
                    <td className='items-center py-2 border border-white text-center'>
                      <span className='cursor-pointer mx-2' onClick={() => editPassword(item.id)}>
                        <lord-icon src="https://cdn.lordicon.com/gwlusjdu.json" trigger="hover" style={{ width: "25px", height: "25px" }}></lord-icon>
                      </span>
                      <span className='cursor-pointer mx-2' onClick={() => deletePassword(item.id)}>
                        <lord-icon src="https://cdn.lordicon.com/skkahier.json" trigger="hover" style={{ width: "25px", height: "25px" }}></lord-icon>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;

