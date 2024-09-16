/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react";
import { FC, useRef, useState } from "react";
import { HiPaperClip } from "react-icons/hi";


interface PropsModalEditTask {
    isOpenModal: boolean
    onclick: any
    card_id: number

}

const ModalEditTask: FC<PropsModalEditTask> = function (props: PropsModalEditTask) {


    const [comment, setComment] = useState<string>('');
    const inputRef = useRef();


    return (
        <Modal show={props.isOpenModal} onClose={props.onclick}>
            <Modal.Header>Editar Tarefa</Modal.Header>
            <form action="" method="post">
                <Modal.Body>
                    <div className="mb-4 w-full rounded-lg border border-gray-100 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                        <div className="p-4">
                            <Label htmlFor="compose-mail" className="sr-only">
                                Seu comentário
                            </Label>
                            <TextInput ref={inputRef} value={props.card_id}></TextInput>
                            <Textarea
                                id="compose-mail"
                                placeholder="Escreva um Comentário..."
                                rows={4}
                                className="border-none text-base focus:ring-0"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between border-t p-4 dark:border-gray-600">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-primary-800"
                            >
                                <HiPaperClip className="mr-1 h-4 w-4" />
                                Postar
                            </button>
                            <div className="flex space-x-1 pl-0 sm:pl-2">

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2">


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex items-center w-full justify-end gap-[10px]">
                        <Button onClick={props.onclick} color="light" type="button">
                            Fechar
                        </Button>
                        <Button type="submit">Editar</Button>
                    </div>
                </Modal.Footer>
            </form>
        </Modal>
    )

}

export default ModalEditTask