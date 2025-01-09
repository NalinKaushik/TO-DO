"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardContent, setCardContent] = useState({ title: "", content: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [dateRange, setDateRange] = useState({ from: "", to: "" }); // Track date range
  const [currentIndex, setCurrentIndex] = useState(0); // Index for swipeable containers

  // Add new card with default status 'To Start'
  const handleAddCard = () => {
    if (!cardContent.title || !cardContent.content) {
      alert("Please fill out the card title and content.");
      return;
    }

    setCards((prevCards) => [
      ...prevCards,
      {
        id: Date.now(),
        title: cardContent.title,
        content: cardContent.content,
        status: "To Start",
        createdAt: new Date(), // Store the card creation date
      }
    ]);
    setCardContent({ title: "", content: "" });
    setIsCardVisible(false); // Hide the card form after adding
  };

  // Update the content of the card
  const handleCardContentChange = (e) => {
    const { name, value } = e.target;
    setCardContent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle swipe left and right
  const handleSwipe = (direction) => {
    if (direction === "left" && currentIndex < 2) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "right" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Filter cards by search query and date range
  const renderCards = (status) => {
    return cards
      .filter((card) => {
        const isInDateRange =
          (!dateRange.from || new Date(card.createdAt) >= new Date(dateRange.from)) &&
          (!dateRange.to || new Date(card.createdAt) <= new Date(dateRange.to));

        return (
          card.status === status &&
          (card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
          isInDateRange // Include date range filter
        );
      })
      .map((card) => (
        <li
          key={card.id}
          className={styles.cards}
        >
          <h3>{card.title}</h3>
          <p>{card.content}</p>
          <span className={styles.cardDate}>
            {new Date(card.createdAt).toLocaleDateString()} {/* Format the date */}
          </span>
          {status === "To Start" && (
            <button onClick={() => moveCard(card.id, "In Progress")}>
              Start
            </button>
          )}
          {status === "In Progress" && (
            <button onClick={() => moveCard(card.id, "Completed")}>
              Complete
            </button>
          )}
        </li>
      ));
  };

  return (
    <div className={styles.main}>
      <div className={styles.sidenav}>
        <h1>ToDo</h1>
        <div className={styles.options}>
          <span>Dashboard</span>
        </div>
      </div>

      <div className={styles.header}>
        <span>Dashboard</span>
        <div className={styles.tasks}>
          <span>My Todo</span>
        </div>
        <div>
          <form id={styles.addnew}>
            <button
              type="button"
              onClick={() => setIsCardVisible(true)}
              className={styles.addnew}
            >
              New Task
            </button>
          </form>
        </div>
      </div>

      {/* Search Box */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>

      {/* Date Range Filter */}
      <div className={styles.dateRange}>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        />
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        />
      </div>

      <div className={styles.parenthead}>
        <div className={styles.heading}>
          <span className={styles.dots} id={styles.dotone}></span>
          <span>To Start</span>
        </div>
        <div className={styles.heading}>
          <span className={styles.dots} id={styles.dottwo}></span>
          <span>In Progress</span>
        </div>
        <div className={styles.heading}>
          <span className={styles.dots} id={styles.dotthree}></span>
          <span>Completed</span>
        </div>
      </div>

      {/* Swipeable container */}
      <div className={styles.swiperContainer} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {/* "To Start" container with add task button */}
        <div className={styles.container}>
          <ul className={styles.list}>{renderCards("To Start")}</ul>
          <button
            onClick={() => setIsCardVisible(true)}
            className={styles.addTaskBtn}
          >
            Add New Task
          </button>
        </div>

        <div className={styles.container}>
          <ul className={styles.list}>{renderCards("In Progress")}</ul>
        </div>

        <div className={styles.container}>
          <ul className={styles.list}>{renderCards("Completed")}</ul>
        </div>
      </div>

      <div className={styles.swipeBtns}>
        <button onClick={() => handleSwipe("right")}>Swipe Left</button>
        <button onClick={() => handleSwipe("left")}>Swipe Right</button>
      </div>

      {isCardVisible && (
        <div className={styles.cardForm}>
          <input
            type="text"
            name="title"
            placeholder="Card Title"
            value={cardContent.title}
            onChange={handleCardContentChange}
          />
          <textarea
            name="content"
            placeholder="Card Content"
            value={cardContent.content}
            onChange={handleCardContentChange}
          />
          <button type="button" onClick={handleAddCard}>
            Add Card
          </button>
          <button type="button" onClick={() => setIsCardVisible(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
