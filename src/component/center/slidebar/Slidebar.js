import React, { useState } from 'react';
import './Slidebar.css'; // Import your CSS file

export default function Slidebar() {
  // Use state to manage submenu visibility for each item
  const [isLearningSubmenuOpen, setIsLearningSubmenuOpen] = useState(false);
  const [isCommunitySubmenuOpen, setIsCommunitySubmenuOpen] = useState(false);

  const toggleLearningSubmenu = () => {
    setIsLearningSubmenuOpen(!isLearningSubmenuOpen);
  };

  const toggleCommunitySubmenu = () => {
    setIsCommunitySubmenuOpen(!isCommunitySubmenuOpen);
  };

  return (
    <div className='slide-container'>
      <div className='courses'><ul><li><a>Courses</a></li></ul></div>
      <ul>
        <li>
          <a id='alab' onClick={toggleLearningSubmenu} href="#">Learning
          <svg id='open' width="15" height="15" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L4 4.5L7 1" />
</svg>

          </a>
          {isLearningSubmenuOpen && (
            <ul id="submenu">
              <li><a href="#">Courses</a></li>
              <li><a href="#">Quizzes</a></li>
            </ul>
          )}
        </li>
        <li>
          <a id='alab' onClick={toggleCommunitySubmenu} href="#">Community
          <svg id='open' width="15" height="15" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1L4 4.5L7 1" />
</svg>

          </a>
          {isCommunitySubmenuOpen && (
            <ul id="submenu">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Zalo</a></li>
            </ul>
          )}
        </li>
      </ul>
      <ul><li><a>Settings</a></li></ul>
    </div>
  );
}