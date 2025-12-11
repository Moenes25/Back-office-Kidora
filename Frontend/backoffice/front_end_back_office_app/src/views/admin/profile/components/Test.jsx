import React from "react";
import logoImg from "../../../../assets/img/auth/logo.png";
import { FaAccessibleIcon } from "react-icons/fa";

const Test = () => {
  return (
    <main>
        <section className=""><h1 className="text-2xl font-bold gradient-text ">Activity</h1></section>
        <section className="" >
            <div className="relative w-full h-24 p-4 mt-6 border-b border-l border-gray-600 rounded-l-lg ">
                <div className="absolute flex items-center gap-4 left-[-25px] top-0 bg-white w-full">
                    <img src={logoImg} alt="imag" className="w-12 h-12 bg-white rounded-full shadow-lg  " />
                    <div>
                        <div className="flex items-center gap-1">
                        <h2 className="text-sm font-bold text-gray-800">John Doe :</h2>
                        <p className="text-xs text-gray-700">shares a project document</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-sky-600">
                            <p className="">The 32min ago + Project Links <span className="ml-1 text-green-500 underline-offset-1 hover:underline ">university Birds</span></p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-[-20px] border border-gray-200 p-2 bg-white w-full shadow-lg flex items-center gap-2 rounded-lg ">
                    <FaAccessibleIcon />
                    <p className="text-xs font-semibold ">Retourne  a la page de ajouter des entrepriser</p>
                </div>
            </div>
        </section>
    </main>
  );
};

export default Test;
