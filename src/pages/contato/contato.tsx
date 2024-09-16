import { FC, useEffect, useState } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Button, Modal } from "flowbite-react";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import { getContacts } from "../../api/contact/contactApi";
import { format } from "date-fns";
import { HiPlus } from "react-icons/hi";


const ContactPage: FC = function () {

    return (
        <NavbarSidebarLayout>
            <div className="px-4 pt-6">

                {/* content page here */}
                <TableContacts></TableContacts>

            </div>
        </NavbarSidebarLayout>
    );
}


const TableContacts: FC = function () {


    const { enterprise } = useEnterpriseContext();
    const [contactsList, setContactList] = useState<{name: string; email: string; owner: string; created_at: string}[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);


    useEffect(() => {
        const getContactsByEnterprise = async () => {

            try {
                const results = await getContacts(enterprise.id);
                setContactList(results.contacts);
            } catch (error) {
                console.log(error);
            }

            
        }
        getContactsByEnterprise();
    }, [enterprise])


    return (
        <div className="min-h-48 rounded-lg bg-white p-4 shadow sm:p-6 xl:p-8 dark:bg-gray-800">
            <div className="flex items-center justify-between">
                <h4 className="text-3xl dark:text-white">Meus Contatos</h4>
                <Button className="flex items-center " onClick={() => setOpenModal(true)} color="success">
                    <HiPlus></HiPlus>
                    Adicionar novo contato
                </Button>
            </div>

            <Modal size="7xl" onClose={() => setOpenModal(false)} show={openModal}>
                <Modal.Header>Adicionar novo contato</Modal.Header>
                <Modal.Body>
                    <div className="mb-6 grid grid-cols-1 gap-y-2">
                        <form action="" method="post">
                            <div className="mb-6">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                                <input type="text" id="name" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite um nome..." required />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="surname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sobrenome</label>
                                <input type="text" id="surname" name="surname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite um sobrenome..." required />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                                <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Digite um e-mail..." required />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            <div className="section-table mt-[30px]">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    E-mail
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Inscrito
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Proprietario
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
                            {contactsList &&

                                contactsList.map((contact, index) => (
                                    <tr key={index} className=" border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600">
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                        >
                                            {contact.email}
                                        </th>
                                        {contact.email != '' &&
                                            <td className="px-6 py-4">
                                                <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">e-mail</span>
                                            </td>
                                        }

                                        <td className="px-6 py-4">{contact.owner}</td>
                                       
                                        <td className="px-6 py-4">{format(contact.created_at, 'dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button type="button">
                                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z" clipRule="evenodd" />
                                                </svg>

                                            </button>
                                        </td>
                                    </tr>
                                ))

                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default ContactPage