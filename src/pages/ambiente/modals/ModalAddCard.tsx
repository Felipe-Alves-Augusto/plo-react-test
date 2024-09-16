
import { FC, FormEvent, useEffect, useState } from "react";
import { Button, Label, Modal, Select, Textarea, TextInput } from "flowbite-react";
import { useParams } from "react-router";
import { useEnterpriseContext } from "../../../context/EnterpriseContext";



import {  HiPlus } from "react-icons/hi";
import { createCards } from "../../../api/cards/cardsApi";
import { useAuth } from "../../../context/AuthContext";
import { createContact } from "../../../api/contact/contactApi";
import { getAllInputsEnvironment, updatedValuesInputs } from "../../../api/inputs/inputsApi";
import toast, { Toaster } from "react-hot-toast";


interface PropsModalAddCard {
    pipeline_item_id: number; // Definir o tipo correto da propriedade

}
const ModalAddCard: FC<PropsModalAddCard> = function ({ pipeline_item_id }) {

    interface InputEnvironmnt {
        id: number;
        name: string;
        type: "text" | "number" | "date" | "select";
        options?: string; // Supondo que opções sejam uma string que precisa ser convertida,
    }



    const [openModalAddCard, setOpenModalAddCard] = useState<boolean>(false);
    const [nameCard, setNameCard] = useState<string>('');
    const [emailCard, setEmailCard] = useState<string>('');
    const [descriptionCard, setDescriptionCard] = useState<string>('');
    const [checkBoxContact, setCheckBoxContact] = useState<boolean>(false);

    const [inputsEnvironmentList, setInputsEnvironmentList] = useState<InputEnvironmnt[]>([]);

    const [formValues, setFormValues] = useState<{ [key: string]: { value: string | number | Date, id: number } }>({});

    console.log('valores digitados', formValues);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: number) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: { value, id }
        });
    };

    const { enterprise } = useEnterpriseContext();

    const { getUserContext } = useAuth();

    const { environment_id } = useParams();

    const handleCheckboxChange = () => {
        setCheckBoxContact(!checkBoxContact)
    }

    const handleSubmitCard = async (e: FormEvent) => {
        e.preventDefault();
        const userData = getUserContext();

        if (checkBoxContact) {
            try {

                await createContact(enterprise.id, emailCard, enterprise.name);
                toast.success('Tarefa criada com sucesso!');

            } catch (error) {
                console.log(error);
            }
        }

        if (userData != null) {
            try {
                await createCards(nameCard, emailCard, descriptionCard, userData.id, pipeline_item_id);

                const promisesInputPut = Object.keys(formValues).map(async (key) => {

                    const { value, id } = formValues[key];
                    await updatedValuesInputs(id.toString(), value.toString(), Number(environment_id));
                });

                await Promise.all(promisesInputPut);

                console.log('todos os campos atualizados com sucesso');


                setOpenModalAddCard(false);
                setNameCard('');
                setDescriptionCard('');
                setEmailCard('');

            } catch (error) {
                console.log(error);
            }
        }


    }

    useEffect(() => {
        const listInputs = async () => {

            try {
                const result = await getAllInputsEnvironment(environment_id);

                setInputsEnvironmentList(result.card); // lista de campos
            } catch (error) {
                console.log(error);
            }
        }

        listInputs();

    }, [environment_id])

    const convertOptionsStringToArray = (optionsString: string): string[] => {
        return optionsString
            .slice(1, -1) // Remove o primeiro e o último caractere ('[' e ']')
            .split("', '") // Divide a string nos separadores de opções
            .map((option) => option.replace(/'/g, "").trim()); // Remove aspas e espaços em branco
    };



    const renderInputsEnvironments = (input: InputEnvironmnt) => {
        switch (input.type) {
            case "text":
                return (
                    <div className="mb-6">
                        <Label className="capitalize" htmlFor={input.name}>{input.name}</Label>

                        <TextInput required value={formValues[input.name]?.value as string | number || ''} name={input.name} type="text" placeholder="Digite algo..." className="mt-2" onChange={(e) => handleInputChange(e, input.id)}></TextInput>
                    </div>
                )



            case "number":
                return (
                    <div className="mb-6">
                        <Label className="capitalize" htmlFor={input.name}>{input.name}</Label>
                        <TextInput required value={formValues[input.name]?.value as string | number || ''} type="number" name={input.name} placeholder="Digite um número" className="mt-2" onChange={(e) => handleInputChange(e, input.id)}></TextInput>
                    </div>
                )



            case "date":
                return (
                    <div className="mb-6">
                        <Label className="capitalize" htmlFor={input.name}>{input.name}</Label>
                        <TextInput required value={formValues[input.name]?.value as string | number || ''} name={input.name} placeholder="Selecione uma data..." type="date" className="mt-2" onChange={(e) => handleInputChange(e, input.id)}></TextInput>
                    </div>
                )



            case "select": {
                const optionsArray = convertOptionsStringToArray(input.options || "");
                return (
                    <div className="mb-6">
                        <Label className="capitalize" htmlFor={input.name}>{input.name}</Label>
                        <Select value={formValues[input.name]?.value as string | number || ''} className="mt-2" required name={input.name} onChange={(e) => handleInputChange(e, input.id)}>
                            {optionsArray.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </div>
                )
            }



            default:
                return null;
        }
    }

    return (
        <>
            <Toaster toastOptions={{
                style: {
                    background: '#84e1bc',
                    color: '#03543f',
                    fontWeight: 'bold'
                }
            }} />


            <Modal show={openModalAddCard} onClose={() => setOpenModalAddCard(false)}>
                <Modal.Header>Adicionar nova tarefa</Modal.Header>
                <Modal.Body>
                    <form className="h-[600px] overflow-y-scroll px-3" method="POST" onSubmit={handleSubmitCard}>
                        <div className="mb-6">
                            <Label htmlFor="title">Título</Label>
                            <TextInput required value={nameCard} onChange={(e) => setNameCard(e.target.value)} id="titleCard" name="titleCard" className="mt-2" placeholder="Nome do card..."></TextInput>
                        </div>

                        <div className="mb-6">
                            <Label htmlFor="email">E-mail</Label>
                            <TextInput required value={emailCard} onChange={(e) => setEmailCard(e.target.value)} type="email" id="email" name="email" placeholder="E-mail de contato..."></TextInput>
                        </div>

                        {inputsEnvironmentList && inputsEnvironmentList.length > 0 &&
                            inputsEnvironmentList.map((input) => (
                                <>
                                    {renderInputsEnvironments(input)}
                                </>
                            ))
                        }

                        <div className="mb-6">
                            <Label htmlFor="content">Descrição</Label>
                            <Textarea required value={descriptionCard} onChange={(e) => setDescriptionCard(e.target.value)} className="h-[165px] resize-none" name="content" id="content" placeholder="Descrição do card..."></Textarea>
                        </div>



                        <div className="mb-6 flex items-center">
                            <input
                                id="default-checkbox"
                                type="checkbox"
                                checked={checkBoxContact}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                            />
                            <label
                                htmlFor="default-checkbox"
                                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                                Registrar contato na lista de contatos?
                            </label>
                        </div>

                        <Modal.Footer className="flex justify-end px-0">
                            <div className="flex items-center gap-x-3">
                                <Button color="gray">
                                    Fechar
                                </Button>
                                <Button color="success" type="submit">
                                    <div className="flex items-center gap-x-2">
                                        <HiPlus className="text-lg" />
                                        Adicionar card
                                    </div>
                                </Button>
                            </div>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <Button
                type="button"
                onClick={() => setOpenModalAddCard(true)}
                color="gray"
                className="flex w-full items-center justify-center whitespace-nowrap rounded-lg border-2 border-dashed border-gray-200 bg-transparent px-5 py-2 font-semibold text-gray-500 duration-300 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
            >
                <>
                    <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="mt-0.5">Adicionar um novo card</span>
                </>

            </Button>
        </>
    )
}

export default ModalAddCard