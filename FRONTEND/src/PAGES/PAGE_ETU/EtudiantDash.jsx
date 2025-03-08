import React from 'react';
import Navbar from '../components/Navbar';
import ExamList from './ExamList';
import SubmitExam from './SubmitExam';

const EtudiantDash = () => {
  return (
    <div>
      <Navbar />
      <ExamList />
      <SubmitExam />
    </div>
  )
}

export default EtudiantDash
