import React, { useState } from 'react';

import Dropdown from './Dropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { ITask } from '../Task';
import TaskItem from './TaskItem';

export interface ITaskListProps {
   tasks: ITask[];
   setTask: React.Dispatch<React.SetStateAction<ITask[]>>;
}

export interface IDependency {
    total: number
    done: number
    complete: number
}

const TaskList: React.FC<ITaskListProps>  = ({ tasks, setTask }) => {

    const filterOptions = [
        { label: 'All', value: 'ALL' },
        { label: 'In Progress', value: 'IN PROGRESS' },
        { label: 'Done', value: 'DONE' },
        { label: 'Complete', value: 'COMPLETE' },
    ];

    const [filter, setStatusFilter] = useState("ALL");

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const filteredTaskList = filter === "ALL" ? tasks : tasks.filter((task) => task.status === filter)

    const countDependencies = (taskId: number): IDependency => {
        let dependencies = {
            total: tasks.filter((task) => taskId === task.parentId).length,
            done: tasks.filter((task) => taskId === task.parentId && task.status === "DONE").length,
            complete: tasks.filter((task) => taskId === task.parentId && task.status === "COMPLETE").length
        }
        
        return dependencies;
    }

    const handleTaskUpdate = (inputTask: ITask) => {
        if(tasks.filter((task) => task.id === inputTask.parentId).length === 0 && inputTask.parentId !== undefined) {
            alert("The parent task does not exist!")
            return
        }

        if(tasks.filter((task) => task.id === Number(inputTask.parentId) && task.parentId !== undefined).length >= 1)
        {
            alert("The parent task selected has a parent Id assigned and cannot be assigned as a parent!")
            return
        }

        if(tasks.filter((task) => inputTask.id === task.parentId).length > 0) {
            alert("Can't assign a parent task as a child task! Please reassign the dependencies first.")
            return
        }

        tasks = tasks.map(task => {
            if (task.id === inputTask.id)
            {
                return {...task, 
                    name: inputTask.name,
                    parentId: inputTask.parentId};
            }
            return task
        })

        handleStatusChange(inputTask)
    }

    const handleStatusChange = (inputTask: ITask) => {
        if(tasks.filter((task) => inputTask.id === task.parentId).length === 0 && inputTask.parentId === undefined && inputTask.status === "DONE") inputTask.status = "COMPLETE";

        let taskUpdate = tasks.map(task => {
            if (task.id === inputTask.id)
            {
                return {...task, status: inputTask.status};
            }
            return task
        })

        if(inputTask.parentId !== undefined)
        {
            let total = taskUpdate.filter((task) => inputTask.parentId === task.parentId).length
            let doneAndComplete = taskUpdate.filter((task) => inputTask.parentId === task.parentId && (task.status === "DONE" || task.status === "COMPLETE")).length
            let parentIsComplete = taskUpdate.filter((task) => task.id === inputTask.parentId && (task.status === "COMPLETE")).length

            if(total === doneAndComplete)
            {
                taskUpdate = taskUpdate.map(task => {
                    if (task.id === inputTask.id || task.parentId === inputTask.parentId || task.id === inputTask.parentId)
                    {
                        return {...task, status: "COMPLETE"};
                    }
                    return task
                })
            } 
            else if (parentIsComplete === 1)
            {
                taskUpdate = taskUpdate.map(task => {
                    if (task.id === inputTask.parentId)
                    {
                        return {...task, status: "DONE"};
                    }
                    return task
                })
            }
        }

        setTask(taskUpdate);
    }

    const renderTaskList = (): JSX.Element[] => {
        return tasks
            .filter(task => task.parentId === undefined)
            .map((task) => {
                return (   
                    <Card border="primary" className="mx-auto my-3">   
                        <TaskItem task={task} dependencies={countDependencies(task.id)} onStatusUpdate={handleStatusChange} onTaskUpdate={handleTaskUpdate} key={task.id}/>
                        {renderChildTaskList(task.id)}
                    </Card>
                )
            })
    }

    const renderChildTaskList = (taskParentId: number): JSX.Element[] => {
        return tasks
            .filter(task => task.parentId !== undefined && task.parentId === taskParentId)
            .map((task) => {
                return (      
                    <Card border="secondary" className="mx-3 my-3">
                        <TaskItem task={task} dependencies={countDependencies(task.id)} onStatusUpdate={handleStatusChange} onTaskUpdate={handleTaskUpdate} key={task.id}/>
                    </Card>
                )
            })
    }

    const renderFilteredTaskList = (): JSX.Element[] => {
        return filteredTaskList
            .map((task) => {
                return (   
                    <Card border="primary" className="mx-auto my-3">   
                        <TaskItem task={task} dependencies={countDependencies(task.id)} onStatusUpdate={handleStatusChange} onTaskUpdate={handleTaskUpdate} key={task.id}/>
                    </Card>
                )
            })
    }

    return (
        <Container>
            <Row className="mx-auto my-3">
                <Col as="h3"className="my-2">Tasks Lists</Col>
                <Col></Col>
                <Col>
                    <Dropdown
                        label="Filter by status: "
                        value={filter}
                        options={filterOptions}
                        onChange={handleFilterChange}
                    />
                </Col>
            </Row>
            {filter === "ALL" ? renderTaskList() : renderFilteredTaskList()}
        </Container>
    )
}

export default TaskList;