
import { HiPlus } from "react-icons/hi";


interface PropsInterface {
    title: string
    children: React.ReactNode;
    buttonName?: string
    isButton?: boolean
    onclick?: (event: React.MouseEvent<HTMLButtonElement>) => void

}

export default function TitlePage(props: PropsInterface) {

    return (
        <div className="overflow-x-auto flex-1">
            <div className="inline-block min-w-full align-middle">
                <div className="flex items-start justify-start px-4 mb-6 space-x-4">
                    <div className="flex-1 py-4 overflow-x-auto">
                        <div className="p-4 bg-white rounded-lg shadow sm:p-6 xl:p-8 dark:bg-gray-800 min-h-48">
                            <div className="flex items-center justify-between flex-1 mb-8">
                                <h4 className="text-3xl dark:text-white">
                                    {props.title}
                                </h4>
                                {props.isButton &&
                                    <button type="button" onClick={props.onclick} className="flex items-center focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                        <HiPlus className="mt-0.5 mr-2" />
                                        {props.buttonName}
                                    </button>
                                }
                                
                            </div>

                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}