import React, { useState } from 'react';
import logo from './logo.svg';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ITask } from './Task';
import TaskList from './component/TaskList';
import TaskForm from './component/TaskForm';
import Container from 'react-bootstrap/Container';

function App() {

  const [tasks, setTask ] = useState<ITask[]>([
  ])

  return (
    <Container>
      <h1>Task Management System</h1>
      <TaskForm tasks={tasks} setTask={setTask}/>
      <TaskList tasks={tasks} setTask={setTask}/>
    </Container>
  )
}

export default App;
