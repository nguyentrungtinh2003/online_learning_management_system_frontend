import React from "react";

export default function SectionOne() {
  return (
    <div>
      <div className="">
        <p className="text-2xl font-semibold flex">
          Code Arena is more than just an online learning platform. It's your
          gateway to a world of coding knowledge. Earn points by completing free
          courses, quizzes, and challenges. Level up to unlock exclusive rewards
          and use your hard-earned coins to purchase premium courses and access
          premium features.
        </p>
        <p className="">Way to earn Point & Coins</p>
      </div>
      <div>
        <p>Point</p>
        <ul>
            <li>Complete A Course</li>
            <li>Do Quizzes</li>
            <li>Evaluate courses</li>
            <li>Invite friends</li>
        </ul>
      </div>
      <div>
        <p>Coins</p>
        <ul>
            <li>Do Quizzes</li>
            <li>Receive Rewards From Rankings</li>
            <li>Pop Up</li>

        </ul>
      </div>
    </div>
  );
}
