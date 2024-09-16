/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, FormEvent, useEffect, useState } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useParams } from "react-router";
import { createPipelineEnvironment, getPipelineEnvironment } from "../../api/pipeline/pipelineApi";
import { ReactSortable, Sortable } from "react-sortablejs";
import { PipelineTitle } from "../../components/PipelineTitle";
import { HiClock, HiPencilAlt, HiPlus } from "react-icons/hi";
import { updateCardOrder } from "../../api/cards/cardsApi";
import toast, { Toaster } from "react-hot-toast";
import ModalAddCard from "./modals/ModalAddCard";
import ModalEditTask from "./modals/ModalEditTask";


const AmbientePage: FC = function () {


    return (
        <NavbarSidebarLayout>
            <div className="px-4 pt-6">

                {/* content page here */}

                <KanbanAmbiente></KanbanAmbiente>
            </div>
        </NavbarSidebarLayout>
    );
};


const KanbanAmbiente: FC = function () {

    interface PipelineAtributtes {
        id: number
        name: string
        cards: [{
            id: number
            title: string
            description: string
        }]

    }

    const [listPipeline, setListPipeline] = useState<PipelineAtributtes[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [namePipeline, setNamePipeline] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [showModalEditTask, setShowModalEditTask] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<number>(null);


    const { environment_id } = useParams();


    useEffect(() => {
        const getPipelines = async () => {

            try {
                const result = await getPipelineEnvironment(environment_id);

                setListPipeline(result.pipelines);
            } catch (error) {

                console.log(error);

            } finally {
                setLoading(false);
            }
        }


        getPipelines();

    }, [environment_id])


    const handleNamePipeline = (e: any) => {
        setNamePipeline(e.target.value);
    }

    const handleSubmitForm = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await createPipelineEnvironment(namePipeline, environment_id);
            toast.success('Pipeline criada com sucesso!');
            setOpenModal(false);
            setNamePipeline('');

        } catch (error) {
            console.log(error);
        }
    }





    const handleSubmitKanbanOrder = async (e: Sortable.SortableEvent) => {

        try {
            const result = await updateCardOrder(e.to.id, e.newIndex, e.item.id);

            console.log('ordem trocado com sucesso', result);
        } catch (error) {
            console.log(error);
        }
    }


    const handleEditClick = (id) => {
        setSelectedCardId(id); // Define o ID do card selecionado
        setShowModalEditTask(true);
        
      };

    return (
        <div className="min-h-screen-menu overflow-x-auto relative">
            <Toaster toastOptions={{
                style: {
                    background: '#84e1bc',
                    color: '#03543f',
                    fontWeight: 'bold'
                }
            }} />

            <div className="inline-block min-w-full align-middle ">
                <div className="mb-6 flex items-start justify-start gap-x-4 px-4 relative w-full">
                    {loading ? (
                        <div className="mt-4 flex flex-1 flex-col items-center justify-center py-4">

                            <div role="status" className=" animate-pulse w-full">
                                <div className="flex items-center justify-between">
                                    <div className="h-2.5 bg-gray-200 rounded-full  dark:bg-gray-700 w-48 mb-4"></div>
                                    <div className="h-2.5 bg-gray-200 rounded-full  dark:bg-gray-700 w-48 mb-4"></div>
                                    <div className="h-2.5 bg-gray-200 rounded-full  dark:bg-gray-700 w-48 mb-4"></div>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700  mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                <span className="sr-only">Loading...</span>
                            </div>


                        </div>
                    ) : listPipeline?.length === 0 ? (
                        <div className="mt-4 flex flex-1 flex-col items-center justify-center py-4">
                            <h4>Você ainda não tem nem uma pipeline cadastrada</h4>
                            <div className="mt-4">
                                <Button
                                    onClick={() => setOpenModal(true)}
                                    gradientDuoTone="greenToBlue"
                                >
                                    Adicionar nova pipeline
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {listPipeline?.map((pipelineItem) => (
                                <div id={String(pipelineItem.id)} key={pipelineItem.id}>
                                    <PipelineTitle pipelineItem={pipelineItem as any} />
                                    <ReactSortable
                                        id={String(pipelineItem.id)}
                                        onChange={(event) => handleSubmitKanbanOrder(event)}
                                        animation={100}
                                        className="mb-6 min-h-96 w-[28rem] space-y-4"
                                        delayOnTouchOnly
                                        filter=".wrapper-button"
                                        onMove={(evt) =>
                                            !evt.related.classList.contains("locked_item")
                                        }
                                        forceFallback
                                        group="kanban"
                                        list={pipelineItem.cards}
                                        setList={(tasks) =>
                                            setListPipeline((listItem) => {
                                                if (listItem) {
                                                    const newList = [...listItem];

                                                    const index = newList.findIndex(
                                                        (item) => item.id === pipelineItem.id,
                                                    );

                                                    if (index !== -1 && newList[index]) { // Verificação adicional para garantir que index é válido
                                                        newList[index].cards = tasks as any; // Operação segura agora

                                                        return newList;
                                                    }
                                                }

                                                return [];
                                            })
                                        }
                                    >
                                        {pipelineItem.cards.map((task) => (
                                            
                                            <div
                                                id={String(task.id)}
                                                key={task.id}
                                                className="mb-4 w-[28rem] cursor-grab rounded-lg bg-white p-5 shadow dark:bg-gray-800"
                                            >
                                                <ModalEditTask card_id={selectedCardId} isOpenModal={showModalEditTask} onclick={() => setShowModalEditTask(false)} ></ModalEditTask>
                                                <div className="flex items-center justify-between pb-4">
                                                    <div className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {task.title}
                                                    </div>
                                                    <div className="locked_item">
                                                        <button onClick={() => handleEditClick(task.id)}
                                                            type="button"
                                                            className="locked_item rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                                        >
                                                            <span className="sr-only">Edit card</span>
                                                            <HiPencilAlt className="h-5 w-5" />
                                                            

                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="pb-4 text-sm font-normal text-gray-700 dark:text-gray-400">
                                                        {task.description}
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div className="flex items-center justify-center rounded-lg bg-purple-100 px-3 text-sm font-medium text-purple-800 dark:bg-purple-200">
                                                            <HiClock className="mr-1 h-4 w-4" /> 7 days left
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        ))}

                                        <div className="wrapper-button btn-add-card">
                                            <ModalAddCard pipeline_item_id={pipelineItem.id}></ModalAddCard>
                                            
                                        </div>
                                    </ReactSortable>

                                </div>
                            ))}
                            <div className="py-4">
                                <Button
                                    onClick={() => setOpenModal(true)}
                                    color="success"
                                    className="w-[16rem] flex items-center"
                                >
                                    <HiPlus className="mt-0.5 mr-2" />
                                    Adicionar nova pipeline
                                </Button>
                            </div>
                        </>
                    )}

                </div>
                

                <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <form
                        className="overflow-y-auto"
                        onSubmit={handleSubmitForm}
                    >
                        <Modal.Header>Adicionar uma nova pipeline</Modal.Header>
                        <Modal.Body>
                            <div className="space-y-6">
                                <div className="mb-6 grid grid-cols-1 gap-y-2">
                                    <Label htmlFor="namePipeline">Nome da Pipeline</Label>
                                    <TextInput
                                        id="namePipeline"
                                        name="namePipeline"
                                        placeholder="Digite um nome..."
                                        onChange={handleNamePipeline}
                                        value={namePipeline}
                                        required
                                    />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="flex justify-end">
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Cencelar
                            </Button>
                            <Button type="submit" color="success">Adicionar</Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        </div>
    )
}





export default AmbientePage