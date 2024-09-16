/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChangeEvent, FC, useEffect, useState } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import WrapperPage from "../../components/WrapperPage";
import { Modal, Select } from "flowbite-react";
import { useAuth } from "../../context/AuthContext";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import { getAllEnvironment } from "../../api/ambientes/ambientesApi";
import { createInputs, getAllInputsEnvironment } from "../../api/inputs/inputsApi";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

const CamposPipelinePage: FC = function () {
    return (
        <NavbarSidebarLayout>
            <div className="px-4 pt-6">
                {/* content page here */}
                <TableCampos></TableCampos>
            </div>
        </NavbarSidebarLayout>
    );
};

const TableCampos: FC = function () {

    interface Filed {
        type: "text" | "number" | "date" | "select";
        value: string;
        id: number;
        options?: string[];
    }


    const [openModal, setOpenModal] = useState<boolean>(false);
    const [fields, setFields] = useState<Filed[]>([]);
    const [newOptions, setNewOptions] = useState<{ [key: number]: string[] }>({}); // Estado para gerenciar opções de cada campo select
    const [labelInput, setLabelInput] = useState<string>("");
    const [activeFieldId, setActiveFieldId] = useState<number | null>(null);
    const [listEnvironment, setListEnvironment] = useState<{ id: number; name: string }[]>([]);
    const [selectEnvironment, setSelectEnvironment] = useState<number>(1);
    const [inputsEnviroment, setInputsEnvironment] = useState<{ name: string; type: string; options: string; created_at: string }[]>([]);

    const { getUserContext } = useAuth();
    const userData = getUserContext();
    const { enterprise } = useEnterpriseContext();





    // função para adicionar novos campos
    const handleAddFields = (type: "text" | "number" | "date" | "select") => {
        if (fields.length === 0 || activeFieldId !== null) {
            const newField = {
                type,
                value: "",
                id: fields.length,
                options: type === "select" ? [""] : [],
            };

            //campos diferentes do select
            setFields((prevFields) => [...prevFields, newField]);

            // Se o campo for do tipo 'select', defina o campo ativo para adicionar opções
            if (type === "select") {
                setNewOptions((prevOptions) => ({
                    ...prevOptions,
                    [newField.id]: [""],
                }));
                setActiveFieldId(newField.id);
            } else {
                setActiveFieldId(null);
            }
        } else {
            alert("Preencha o campo existente antes de adicionar outro campo");
        }
    };

    //   const convertOptionsStringToArray = (optionsString: string): string[] => {
    //     return optionsString
    //       .slice(1, -1) // Remove o primeiro e o último caractere ('[' e ']')
    //       .split("', '") // Divide a string nos separadores de opções
    //       .map((option) => option.replace(/'/g, "").trim()); // Remove aspas e espaços em branco
    //   };

    // Função separada para resetar os estados
    const resetFields = () => {
        setLabelInput(""); // Limpa o input
        setFields([]); // Limpa o array de campos
        setNewOptions({}); // Limpa as opções
        setActiveFieldId(null); // Reseta o campo ativo
    };

    const resetSelect = () => {
        const selectElement = document.getElementById(
            "type-select",
        ) as HTMLSelectElement;
        if (selectElement) {
            selectElement.value = ""; // Redefine para o valor inicial
        }
    };

    // fuction para salvar os campos no banco de dados
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (fields[0]) {
            const optionsArray = fields[0] ? newOptions[fields[0].id] || [] : [];
            const optionsString = `['${optionsArray.join("', '")}']`; // array no formato string

            try {

                await createInputs(labelInput, ' ', "['Pausado', 'Em andamento', 'Entregue']", fields[0].type, selectEnvironment, optionsString);
                toast.success('Campo criado com sucesso!');

                resetSelect();
                resetFields();
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Função para adicionar uma nova opção ao campo select
    const addOptionToField = (fieldId: number) => {
        setNewOptions((prevOptions) => ({
            ...prevOptions,
            [fieldId]: [...(prevOptions[fieldId] || []), ""],
        }));
    };

    // Função para atualizar o valor da nova opção
    const handleOptionChange = (
        fieldId: number,
        optionIndex: number,
        value: string,
    ) => {
        setNewOptions((prevOptions) => {
            const updatedOptions = [...(prevOptions[fieldId] || [])];
            updatedOptions[optionIndex] = value;
            return { ...prevOptions, [fieldId]: updatedOptions };
        });
    };


    // função para trocar o valor do input da label
    const handleLabelInput = (event: ChangeEvent<HTMLInputElement>) => {
        setLabelInput(event.target.value);

    };

    const handleCloseModal = () => {
        setOpenModal(false);
        resetFields();
        resetSelect();
    }


    useEffect(() => {
        const environmentAll = async () => {

            if (userData != null && enterprise?.id != null) {
                try {
                    const result = await getAllEnvironment(userData.id, enterprise?.id);

                    setListEnvironment(result.environments);

                } catch (error) {
                    console.log(error);
                }
            }
        }

        environmentAll();
    }, [enterprise, userData]);



    // Fetch inputs based on selected environment
    useEffect(() => {
        const fetchInputsEnvironmentList = async () => {
            if (!selectEnvironment) return;

            try {
                const result = await getAllInputsEnvironment(selectEnvironment);
                console.log('inputs', result);
                setInputsEnvironment(result.card);
            } catch (error) {
                console.log(error);
            }
        };

        fetchInputsEnvironmentList();
    }, [selectEnvironment, inputsEnviroment]);

    const handleSelectEnvironment = (event: any) => {
        setSelectEnvironment(event.target.value);
    };





    return (
        <WrapperPage title="Campos da pipeline" isButton={true} buttonName="Adicionar campos" onclick={() => setOpenModal(true)}>
            <Toaster toastOptions={{
                style: {
                    background: '#84e1bc',
                    color: '#03543f',
                    fontWeight: 'bold'
                }
            }} />
            <Modal show={openModal} onClose={handleCloseModal}>
                <Modal.Header>Adicinar campos</Modal.Header>
                <Modal.Body>
                    <form className="mt-4" onSubmit={handleSubmitForm} method="POST">
                        <div className="mb-4">
                            <label
                                htmlFor="name_atributo"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Nome do campo
                            </label>
                            <input
                                onChange={handleLabelInput}
                                type="text"
                                id="name_atributo"
                                name="name_atributo"
                                value={labelInput}
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="countries"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Tipo do campo
                            </label>
                            <select
                                onChange={(e) =>
                                    handleAddFields(
                                        e.target.value as
                                        | "text"
                                        | "number"
                                        | "date"
                                        | "select",
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            >
                                <option value="">selecione um tipo de campo</option>
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                                <option value="select">Select</option>
                            </select>
                        </div>

                        <div className="mt-[20px]">
                            {fields.map((field) => (
                                <div key={field.id}>
                                    {field.type === "select" && (
                                        <>
                                            {newOptions[field.id]?.map((option, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-2 flex items-center "
                                                >
                                                    <input
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) =>
                                                            handleOptionChange(
                                                                field.id,
                                                                index,
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder={`Opção ${index + 1}`}
                                                        className="mr-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                type="button"
                                                onClick={() => addOptionToField(field.id)}
                                            >
                                                Adicionar Opção
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-[30px] flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 dark:border-gray-700">
                            <div className="mt-[30px] flex items-center gap-x-3 pb-5 pr-5">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className=":ring-cyan-700 group relative flex items-stretch justify-center rounded-lg border border-gray-200 bg-white p-0.5 text-center font-medium text-gray-900 transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:text-cyan-700 focus:outline-none focus:ring-4 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 dark:border-gray-600 dark:bg-transparent dark:text-gray-400 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white"
                                >
                                    <span className="flex items-stretch rounded-md px-4 py-2 text-sm transition-all duration-200">
                                        Fechar
                                    </span>
                                </button>

                                <button

                                    type="submit"
                                    className="group relative flex items-stretch justify-center rounded-lg border border-transparent bg-blue-700 p-0.5 text-center font-medium text-white transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    <span className="flex items-stretch rounded-md px-4 py-2 text-sm transition-all duration-200">
                                        <div className="flex items-center gap-x-2">
                                            <svg
                                                stroke="currentColor"
                                                fill="currentColor"
                                                strokeWidth="0"
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                                className="text-lg"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            Adicionar campo
                                        </div>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <div className="section-table mt-[40px]">
                <Select value={selectEnvironment} onChange={handleSelectEnvironment} className="w-56 mb-[20px]">
                    <option value="">Selecione uma pipeline</option>
                    {listEnvironment &&
                        listEnvironment.map((environment, index) => (

                            <>
                                <option key={index} value={environment.id}>{environment.name}</option>
                            </>
                        ))
                    }
                </Select>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Nome do campo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tipo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Opções
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Data Adicionada
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Açãos
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputsEnviroment ?
                                inputsEnviroment.map((input) => (
                                    <>
                                        <tr className=" border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                            <th
                                                scope="row"
                                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                            >
                                                {input.name}
                                            </th>

                                            <td className="px-6 py-4">
                                                {input.type}
                                            </td>


                                            <td className="px-6 py-4">{input.options}</td>
                                            <td className="px-6 py-4">{format(input.created_at, 'dd/MM/yyyy')}</td>
                                            <td className="px-6 py-4"></td>

                                        </tr>
                                    </>
                                ))
                                :
                                <tr className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                    <td className="w-full text-center">Nenhum campo encontrado!</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </WrapperPage>

    )
}

export default CamposPipelinePage


{/*  */ }