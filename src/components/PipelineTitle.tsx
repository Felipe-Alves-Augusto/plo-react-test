/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { MdClose } from "react-icons/md";
import { updatedPipelineEnvironment } from "../api/pipeline/pipelineApi";
import { InvisibleInput } from "./InvisibleInput";



interface PropsPipelineKanban {
    pipelineItem: { name: string; id: string; sort: number; environment_id: number }
}
export function PipelineTitle(props: PropsPipelineKanban) {
   

    const [name, setName] = useState<string>(props.pipelineItem.name);
    

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            
            await updatedPipelineEnvironment(props.pipelineItem.id, name, props.pipelineItem.sort, props.pipelineItem.environment_id);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form className="relative group focus-within:group mb-3" onSubmit={(e) => handleSubmit(e)}>
            <InvisibleInput className="font-semibold text-gray-900" value={name} setValue={setName} />
            
            <div className="absolute top-1/2 -translate-y-1/2 right-2 flex flex-row gap-x-2 items-center">
                <button
                    type="submit"
                    className="group items-stretch justify-center p-0.5 text-center font-medium transition-all duration-300 ease-in-out opacity-0 group-focus-within:opacity-100 group-focus-within:visible focus:z-10 focus:outline-none bg-green-700 to-cyan-600 text-white focus:ring-4 focus:ring-green-200 enabled:hover:bg-green-800 dark:focus:ring-green-800 rounded-lg h-7"
                >
                    <span className="flex items-stretch transition-all duration-200 rounded-md px-4 py-0.5 text-xs">Salvar</span>
                </button>
                <button type="button" className="h-7 w-7 bg-zinc-100 flex justify-center items-center rounded-md">
                    <MdClose />
                </button>
            </div>
        </form>
    )
}