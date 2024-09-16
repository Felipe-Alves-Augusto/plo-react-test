
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState, type FC } from "react";
import "svgmap/dist/svgMap.min.css";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import WrapperPage from "../../components/WrapperPage";
import { Button, Card, FileInput, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { MdClose } from "react-icons/md";

import { useEnterpriseContext } from "../../context/EnterpriseContext";
import { useAuth } from "../../context/AuthContext";
import { createEnvironment, getAllEnvironment } from "../../api/ambientes/ambientesApi";
import { SlOptions } from "react-icons/sl";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AmbientesPage: FC = function () {


    return (
        <NavbarSidebarLayout>
            <div className="px-4 pt-6">

                {/* content page here */}

                <CardsAmbientes></CardsAmbientes>
            </div>
        </NavbarSidebarLayout>
    );
};

const CardsAmbientes: FC = function () {

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedEnvironmentImage, setSelectedEnvironmentImage] = useState<any | null>(null);
    const [formValues, setFormValues] = useState({ nameEnvironment: '', descriptionEnvironment: '', photoEnvironment: '' });
    const [listEnvironment, setListEnvironment] = useState<{ name: string; description: string; id: number }[]>([]);
    const [refreshEnvironment, setRefreshEnvironment] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // estado de loading


    const { enterprise } = useEnterpriseContext();
    const { getUserContext } = useAuth();
    const userData = getUserContext();





    const handleSubmitForm = async (e: any) => {

        e.preventDefault();



        if (userData != null && enterprise != null) {
            try {
                const result = await createEnvironment(userData.id, formValues.nameEnvironment, formValues.descriptionEnvironment, '', enterprise.id);
                console.log('result', result);
                setFormValues({ nameEnvironment: '', descriptionEnvironment: '', photoEnvironment: '' });
                setSelectedEnvironmentImage(null);
                setOpenModal(false);
                
                setRefreshEnvironment(!refreshEnvironment);

                toast.success('Ambiente cadastrado com sucesso!');

            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        const environmentAll = async () => {

            if (userData != null && enterprise != null) {
                try {
                    const result = await getAllEnvironment(userData.id, enterprise?.id);

                    setListEnvironment(result.environments);

                } catch (error) {
                    console.log(error);

                } finally {
                    setLoading(false);
                }
            }


        }

        environmentAll();
    }, [enterprise, userData, refreshEnvironment, loading])

    const handleInputChange = (e: FormEvent) => {
        const { name, value }: any = e.target;
        setFormValues({ ...formValues, [name]: value });
    };


    const removeSelectedImage = () => {
        setSelectedEnvironmentImage(null);
    };

    const changeEnvironmentImage = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedEnvironmentImage(e.target.files[0]);
        }
    };

    const arraySkeletonCards = [1, 2, 3];


    return (
        <>

            {loading ? (
                <div className="flex justify-center items-center gap-[10px] p-4 bg-white rounded-lg shadow sm:p-6 xl:p-8 dark:bg-gray-800 min-h-48">
                    {arraySkeletonCards.map(() =>
                        <>

                            <div role="status" className="w-[370px] h-[407px] p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
                                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                    <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                
                                <span className="sr-only">Loading...</span>
                            </div>

                        </>
                    )}

                </div>
            ) : (
                enterprise != null ? (
                    <WrapperPage onclick={() => setOpenModal(true)} title="Meus Ambientes" isButton={true} buttonName="Adicionar Ambientes">
                        <Toaster toastOptions={{
                            style: {
                                background: '#84e1bc',
                                color: '#03543f',
                                fontWeight: 'bold'
                            }
                        }} />
                        
                           
                        <Modal show={openModal} onClose={() => setOpenModal(false)}>
                            <form method="POST" onSubmit={handleSubmitForm}>
                                <Modal.Header>Adicionar Ambiente</Modal.Header>
                                <Modal.Body>
                                    <div className="grid grid-cols-2 gap-x-3">
                                        <div className="col-span-2 my-3">
                                            <Label
                                                htmlFor="imageEnvironment"
                                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                            >
                                                {selectedEnvironmentImage ? (
                                                    <div className="relative overflow-hidden rounded-lg">
                                                        <img
                                                            className="object-cover object-center w-full h-full aspect-video"
                                                            src={URL.createObjectURL(selectedEnvironmentImage)}
                                                            alt="Thumb"
                                                        />
                                                        <button className="absolute right-2 top-2" onClick={removeSelectedImage}>
                                                            <MdClose className="fill-white" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="font-semibold">Clique aqui</span> ou arraste e solte a imagem
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, JPG ou WEBP</p>
                                                    </div>
                                                )}
                                                <FileInput
                                                    onChange={changeEnvironmentImage}
                                                    id="imageEnvironment"
                                                    name="imageEnvironment"
                                                    className="hidden"
                                                />
                                            </Label>
                                        </div>
                                        <div className="my-3 col-span-full">
                                            <Label htmlFor="nameEnvironment" className="block mb-2">
                                                Nome
                                            </Label>
                                            <TextInput
                                                id="nameEnvironment"
                                                name="nameEnvironment"
                                                placeholder="Nome da empresa"
                                                onChange={handleInputChange}
                                                value={formValues.nameEnvironment}
                                            />
                                        </div>
                                        <div className="my-3 col-span-full">
                                            <Label htmlFor="descriptionEnvironment" className="block mb-2">
                                                Descrição
                                            </Label>
                                            <Textarea
                                                id="descriptionEnvironment"
                                                name="descriptionEnvironment"
                                                placeholder="Descrição simples da empresa..."
                                                rows={4}
                                                onChange={handleInputChange}
                                                value={formValues?.descriptionEnvironment || ''}
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="flex justify-end">
                                    <Button color="gray" onClick={() => setOpenModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">
                                        Adicionar
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal>

                        {listEnvironment ? (
                            listEnvironment.map((environment) => (
                                <Link to={`/ambiente/${environment.id}`} className="w-[370px] mr-[10px] max-w-sm group" type="button" key={environment.id}>
                                    <Card
                                        className="w-full group-hover:bg-zinc-50 dark:bg-gray-600 dark:group-hover:bg-gray-500 duration-300 scale-[97.8%] group-hover:scale-100"
                                        imgAlt="image"
                                        imgSrc="https://images.unsplash.com/photo-1707760696486-2a2cd7e0b6a6?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    >
                                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                            {environment.name}
                                        </h5>
                                        <p className="font-normal text-gray-700 dark:text-gray-400 line-clamp-4">
                                            {environment.description}
                                        </p>
                                        <Button
                                            color="gray"
                                            className="absolute invisible transition-all duration-300 ease-in-out top-2 right-2 group-hover:visible"
                                        >
                                            <SlOptions />
                                        </Button>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <h2 className="text-gray-800 text-center text-2xl font-bold">Nenhum ambiente encontrado.</h2>
                        )}
                    </WrapperPage>
                ) : (
                    <h2 className="text-gray-800 text-center text-2xl font-bold">Cadastre uma empresa para continuar.</h2>
                )
            )}


        </>
    )
}


export default AmbientesPage
