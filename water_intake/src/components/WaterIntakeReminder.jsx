import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './WaterIntakeReminder.css'; 

import sound from "../assets/sound.mp3"; 

const WaterIntakeReminder = () => {
  const [goal, setGoal] = useState(8); 
  const [intake, setIntake] = useState(0); 
  const [reminderTime, setReminderTime] = useState(60); 
  const audioRef = useRef(new Audio(sound)); 

  // Load saved data from local storage when component mounts
  useEffect(() => {
    const savedGoal = localStorage.getItem('goal');
    const savedIntake = localStorage.getItem('intake');
    const savedReminderTime = localStorage.getItem('reminderTime');

    if (savedGoal) setGoal(parseInt(savedGoal));
    if (savedIntake) setIntake(parseInt(savedIntake));
    if (savedReminderTime) setReminderTime(parseInt(savedReminderTime));

    const interval = setInterval(() => {
      if (!reminderTime || reminderTime <= 0) return; 
      if (intake < goal) {
        toast.info('Time to drink water!');
        
        // Play sound in a loop
        audioRef.current.loop = true;
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }

    }, reminderTime * 60 * 1000);

    return () => {
      clearInterval(interval);
      audioRef.current.pause(); 
      audioRef.current.currentTime = 0; 
    };
  }, [reminderTime, intake, goal]); 

  // Update water intake
  const handleAddWater = () => {
    if (intake < goal) {
      const newIntake = intake + 1;
      setIntake(newIntake);
      localStorage.setItem('intake', newIntake);
      
     
      if (newIntake === goal) {
        toast.success('Congratulations! You have reached your daily water intake goal!');
        
       
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
      }
    }
  };

  // Reset daily water intake
  const resetIntake = () => {
    setIntake(0);
    localStorage.setItem('intake', 0);
  };

  // Update the goal
  const updateGoal = (newGoal) => {
    setGoal(newGoal);
    localStorage.setItem('goal', newGoal);
  };

  // Update reminder time
  const updateReminderTime = (newTime) => {
    setReminderTime(newTime);
    localStorage.setItem('reminderTime', newTime);
  };


  const progress = (intake / goal) * 100;

  return (
    <div className="water-intake-container">
      <h1>Water Intake Reminder</h1>
      <p>Goal: {goal} glasses</p>
      <div className="progress-circle" style={{ background: `conic-gradient(#4caf50 ${progress}%, #ddd ${progress}%)` }}>
        <p>{intake} / {goal}</p>
      </div>
      <button onClick={handleAddWater}>+1 Glass</button>
      <button onClick={resetIntake}>Reset Intake</button>

      <div className="settings">
        <h3>Settings</h3>
        <label>
          Set Daily Goal: 
          <input type="number" value={goal} onChange={(e) => updateGoal(parseInt(e.target.value))} />
        </label>
        <label>
          Reminder Interval (minutes):
          <input type="number" value={reminderTime} onChange={(e) => updateReminderTime(parseInt(e.target.value))} />
        </label>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WaterIntakeReminder;
