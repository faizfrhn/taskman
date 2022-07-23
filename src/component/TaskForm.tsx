import React, { useState } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { ITask } from "../Task";

export interface ITaskFormProps {
    tasks: ITask[];
    setTask: React.Dispatch<React.SetStateAction<ITask[]>>;
}

const TaskForm: React.FC<ITaskFormProps> = ({ tasks, setTask })  => {

    const getMaxId = (): number => {
        return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) : 0;
    }

    const [input, setInput] = useState({
        id: getMaxId() + 1,
        name: "",
        status: "IN PROGRESS",
        parentid: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const handleClick = (): void => {
        if(!input.name)
        {
            alert("The task name is required!")
            return
        }

        if(input.parentid)
        {
            if(tasks.filter((task) => task.id === Number(input.parentid)).length === 0) 
            {
                alert("No task with this Id found!");
                return
            }

            if(tasks.filter((task) => task.id === Number(input.parentid) && task.parentId != undefined).length >= 1)
            {
                alert("The parent task selected has a parent Id assigned and cannot be assigned as a parent!")
                return
            }
        }

        setTask([...tasks, 
            {
                id: input.id,
                name: input.name,
                status: input.status,
                parentId: input.parentid ? Number(input.parentid) : undefined
            }
        ])

        setInput({
            id: input.id + 1,
            name: "",
            status: "IN PROGRESS",
            parentid: ""
        })
    }

    return (
        <Container>
            <Form.Control hidden type="number" value={input.id} onChange={handleChange} name="id"/>
            <Form.Control hidden type="text" value={input.status} onChange={handleChange} name="status"/>

            <Form.Label htmlFor="name">Task Name</Form.Label>
            <Form.Control type="text" value={input.name} onChange={handleChange} name="name"/>

            <Form.Label htmlFor="number">Task Parent ID</Form.Label>
            <Form.Control type="number" value={input.parentid} onChange={handleChange} name="parentid"/>

            <Button
                className="my-3"
                onClick={handleClick}
            >
                Add Task
            </Button>
        </Container>
    )
}

export default TaskForm;