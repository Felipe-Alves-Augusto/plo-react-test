/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Button, Dropdown, FileInput, Label, Textarea, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { createEnterprise, getEnterprises } from "../api/enterprise/enterpriseApi";
import { FaChevronDown } from "react-icons/fa";
import { useEnterpriseContext } from "../context/EnterpriseContext";
import toast, { Toaster } from "react-hot-toast";




export default function AsideEnterprise() {

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<null>(null);
    const [nameEnterprise, setNameEnterprise] = useState<string>('');
    const [descriptionEnterprise, setDescription] = useState<string>('');
    const [linkEnterprise, setLinkEnterprise] = useState<string>('');
    const [listEnterprise, setListEnterprise] = useState<{ id: number; name: string; description: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshEnterprises, setRefreshEnterprises] = useState<boolean>(false); // Novo estado para controle de atualização

    const { enterprise, handleEnterpriseChange } = useEnterpriseContext();


    const handleNameEnterprise = (e: any) => {
        setNameEnterprise(e.target.value);
    }

    const handleDescriptionEnterprise = (e: any) => {
        setDescription(e.target.value);
    }

    const handleLinkEnterprise = (e: any) => {
        setLinkEnterprise(e.target.value);
    }


    const formRef = useRef<HTMLFormElement>(null);

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);

    }
    const handleCloseDrawer = () => setIsDrawerOpen(false);

    const imageChange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
    };

    const { getUserContext } = useAuth();
    const userData = getUserContext();

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        if (userData != null) {
            try {
                await createEnterprise(nameEnterprise, userData.id, descriptionEnterprise, '', linkEnterprise);
                setDescription('');
                setLinkEnterprise('');
                setNameEnterprise('');
                setSelectedImage(null);
                setIsDrawerOpen(false);
                toast.success('Empresa cadastrada com sucesso!');
                setRefreshEnterprises(!refreshEnterprises);

            } catch (error) {
                console.log(error);

            }
        }

    }

    useEffect(() => {

        const getListEnterprise = async () => {

            if (userData != null) {
                try {
                    const enterprisesAll = await getEnterprises(userData.id);
                    const enterprisesList = enterprisesAll.enterprises as { id: number; name: string; description: string }[]; // Forçando o tipo
                    setListEnterprise(enterprisesAll.enterprises);

                    if (enterprisesList.length > 0 && enterprisesList[0]) {
                        handleEnterpriseChange(enterprisesList[0]);
                    }


                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }

        }

        getListEnterprise();

    }, [userData, handleEnterpriseChange, refreshEnterprises])


    return (
        <div className="bg-dark">
            <Toaster toastOptions={{
                style: {
                    background: '#84e1bc',
                    color: '#03543f',
                    fontWeight: 'bold'
                }
            }} />

            <div className="relative mb-[30px]">

                {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        {/* Substitua o conteúdo abaixo pelo seu indicador de carregamento */}
                        <div role="status" className="max-w-sm animate-pulse">
                            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>

                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : listEnterprise ? (
                    <Dropdown

                        label=""
                        className="flex-1 w-full max-h-[80vh] overflow-auto"
                        dismissOnClick={false}
                        renderTrigger={() => (
                            <button type="button" className="flex-1 w-full p-2 border rounded-lg">
                                <Avatar className="" rounded>
                                    <div className="flex flex-row w-40">
                                        <div className="w-full space-y-1 font-medium text-left dark:text-white">
                                            <div className="text-zinc-600 line-clamp-1">{enterprise?.name}</div>
                                            <div className="text-sm text-zinc-400 dark:text-gray-400 line-clamp-1">{enterprise?.description}</div>
                                        </div>
                                        <div className="flex items-center">
                                            <FaChevronDown className="fill-zinc-500" />
                                        </div>
                                    </div>
                                </Avatar>
                            </button>
                        )}
                    >
                        {listEnterprise.map((enterpriseItem) =>
                            <>
                                {enterpriseItem.id != enterprise?.id &&
                                    <Dropdown.Item key={enterpriseItem.id} onClick={() => handleEnterpriseChange(enterpriseItem)} disabled={enterpriseItem.id === enterprise?.id} className="bg-zinc-100 cursor-pointer relative transform-none">
                                        <Avatar size="sm" className="flex-1">
                                            <div className="flex-1 w-40">
                                                <div className="space-y-1 font-medium text-left dark:text-white">
                                                    <div className="text-zinc-600 line-clamp-1">{enterpriseItem.name}</div>
                                                    <div className="text-sm text-zinc-400 dark:text-gray-400 line-clamp-1">{enterpriseItem.description}</div>
                                                </div>
                                            </div>
                                        </Avatar>
                                    </Dropdown.Item>
                                }
                            </>

                        )}

                        <button
                            type="button"
                            onClick={handleOpenDrawer}
                            data-drawer-target="drawer-example"
                            data-drawer-show="drawer-example"
                            aria-controls="drawer-example"
                            className="flex items-center w-full justify-center text-gray-900 bg-white focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                        >
                            <HiPlus className="mt-0.5 mr-2" />
                            Adicionar empresa
                        </button>
                    </Dropdown>
                ) : (
                    <button
                        type="button"
                        onClick={handleOpenDrawer}
                        data-drawer-target="drawer-example"
                        data-drawer-show="drawer-example"
                        aria-controls="drawer-example"
                        className="flex items-center justify-center w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        <HiPlus className="mt-0.5 mr-2" />
                        Adicionar empresa
                    </button>
                )}

            </div>


            <div
                className={`fixed top-[66px] left-0 z-40 h-screen p-4 overflow-y-auto transition-transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} bg-white w-80 dark:bg-gray-800`}

                aria-labelledby="drawer-label"
            >
                <h5 id="drawer-label" className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    Nova empresa
                </h5>
                <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <form ref={formRef} onSubmit={handleSubmitForm} method="POST">
                    <div className="flex items-center justify-center w-full mb-6">
                        <Label
                            htmlFor="image"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            {selectedImage ? (
                                <div className="relative overflow-hidden rounded-lg">
                                    <img
                                        className="object-cover object-center w-full h-full aspect-square"
                                        src={URL.createObjectURL(selectedImage)}
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
                                onChange={imageChange}
                                id="image"
                                name="image"
                                className="hidden"

                            />
                        </Label>
                    </div>
                    <div className="my-3">
                        <Label htmlFor="name" className="block mb-2">
                            Name
                        </Label>
                        <TextInput
                            id="name"
                            name="name"
                            placeholder="Nome da empresa"
                            value={nameEnterprise}
                            onChange={handleNameEnterprise}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="description" className="block mb-2">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Descrição simples da empresa..."
                            rows={4}
                            value={descriptionEnterprise}
                            onChange={handleDescriptionEnterprise}
                            required
                        />
                    </div>
                    <div className="my-3">
                        <Label htmlFor="name" className="block mb-2">
                            Link
                        </Label>
                        <TextInput
                            id="link"
                            name="link"
                            placeholder="Algum link relacionado"
                            value={linkEnterprise}
                            onChange={handleLinkEnterprise}
                            required
                        />
                    </div>

                    <Button color="success" type="submit" className="flex items-center w-full duration-300 ease-in-out mt-4">
                        <HiPlus className="mt-0.5 mr-2" />
                        Adicionar empresa
                    </Button>
                </form>

            </div>
        </div>
    )
}