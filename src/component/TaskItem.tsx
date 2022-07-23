import React, { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import Checkbox from './Checkbox';
import { ITask } from '../Task';
import { IDependency } from './TaskList';

export interface ITaskItemProps {
    task: ITask;
    dependencies: IDependency;
    onStatusUpdate: (task: ITask) => void;
    onTaskUpdate: (task: ITask) => void;
}

const TaskItem: React.FC<ITaskItemProps> = ({ task, dependencies, onStatusUpdate, onTaskUpdate }) => {

    useEffect(() => onStatusUpdate(task), [task.id, task.parentId, task.status]);

    const [editMode, setEditMode] = useState(false);

    const [input, setInput] = useState({
        id: task.id,
        name: task.name,
        status: task.status,
        parentid: task.parentId
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked === true)
        {
            onStatusUpdate({
                id: task.id,
                name: task.name,
                status: "DONE",
                parentId: task.parentId
            });
        } else 
        {
            onStatusUpdate({
                id: task.id,
                name: task.name,
                status: "IN PROGRESS",
                parentId: task.parentId
            });
        }
    };

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const handleSave = (): void => {
        if(!input.name)
        {
            alert("The task name is required!")
            return
        }

        onTaskUpdate({
            id: input.id,
            name: input.name,
            status: input.status,
            parentId: input.parentid ? Number(input.parentid) : undefined
        });

        handleClick()
    }

    const handleClick = (): void => {
        setInput({
            id: task.id,
            name: task.name,
            status: task.status,
            parentid: task.parentId
        })

        setEditMode(!editMode);
    }

    const setStatusColour = (status: string): string => {
        switch(status)
        {
            case "IN PROGRESS":
                return "outline-warning";
            case "COMPLETE":
                return "success";
            default:
                return "outline-primary";
        }
    }

    return (
        <Container fluid className="no-gutters mx-0 px-0">
            <Card.Header>
                <Row>
                    <Col as="h5"className="my-2">
                        {editMode ? 
                            null
                            : <Checkbox done={task.status === "IN PROGRESS" ? false : true} 
                                disabled={task.parentId === undefined && task.status !== "IN PROGRESS" ? true : false} 
                                onChange={handleChange}/>
                        }
                        Task ID: {task.id}
                    </Col> 
                    <Col>
                        <Button variant={setStatusColour(task.status)} style={{float: "right"}}>{task.status}</Button>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Title className="mx-3 my-3">
                <Row>
                <Col>
                    {editMode ? 
                        <Form>
                            <Form.Label htmlFor="name">Task Name</Form.Label>
                            <Form.Control type="text" value={input.name} onChange={handleEdit} name="name"/>
                            <Form.Label htmlFor="number">Task Parent ID</Form.Label>
                            <Form.Control type="number" value={input.parentid} onChange={handleEdit} name="parentid"/>
                        </Form>
                        : task.name
                    }
                </Col>
                <Col>
                    {editMode ? 
                        <Container>
                            <Button variant="danger" className="mx-2" style={{float: "right"}} onClick={handleClick} >
                            Cancel
                            </Button>
                            <Button variant="success" style={{float: "right"}} onClick={handleSave} >
                            Save
                            </Button> 
                        </Container>
                        : 
                        <Button variant="warning" style={{float: "right"}} onClick={handleClick} >
                            Edit
                        </Button> 
                    }      
                </Col>
                </Row>
            </Card.Title>

            {dependencies.total > 0 ? 
                <Card.Body>
                Total dependencies : {dependencies.total} <span>| </span>
                Done dependencies : {dependencies.done} <span>| </span>
                Completed dependencies : {dependencies.complete} <br/>
                </Card.Body>
            : null}
        </Container>
    )
}

export default TaskItem