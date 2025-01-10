"use client";

import { useState , useRef } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [cards, setCards] = useState([]);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [cardContent, setCardContent] = useState({ title: "", content: "" });
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [dateRange, setDateRange] = useState({ from: "", to: "" }); // Track date range
  const [currentIndex, setCurrentIndex] = useState(0); // Index for swipeable containers
  const touchStartX = useRef(0); // Track the starting X position of the touch
  const touchEndX = useRef(0)
  const addButtonRef = useRef(null); // Ref for the "Add New" button
  const containerRefs = useRef([]);


  const handleTouchStart = (e) => {
    // Check if the touch is over the "Add New" button or the container itself
    if (
      (addButtonRef.current && addButtonRef.current.contains(e.target)) ||
      containerRefs.current.some((ref) => ref && ref.contains(e.target))
    ) {
      e.stopPropagation(); // Prevent swipe interaction if over the button or container
      return;
    }
    touchStartX.current = e.touches[0].clientX; // Get the starting position
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    // Check if the touch is over the "Add New" button or the container itself
    if (
      (addButtonRef.current && addButtonRef.current.contains(e.target)) ||
      containerRefs.current.some((ref) => ref && ref.contains(e.target))
    ) {
      e.stopPropagation(); // Prevent swipe interaction if over the button or container
      return;
    }
    touchEndX.current = e.touches[0].clientX; // Get the current position while moving
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      if (currentIndex < 2) {
        setCurrentIndex(currentIndex + 1); // Move to the next container
      }
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1); // Move to the previous container
      }
    }
  };

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
        {/* <span>Dashboard</span> */}
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
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M15.853 16.56c-1.683 1.517-3.911 2.44-6.353 2.44-5.243 0-9.5-4.257-9.5-9.5s4.257-9.5 9.5-9.5 9.5 4.257 9.5 9.5c0 2.442-.923 4.67-2.44 6.353l7.44 7.44-.707.707-7.44-7.44zm-6.353-15.56c4.691 0 8.5 3.809 8.5 8.5s-3.809 8.5-8.5 8.5-8.5-3.809-8.5-8.5 3.809-8.5 8.5-8.5z"/></svg>
      </div>

      {/* Date Range Filter */}
      <div className={styles.dateRange}>
        {/* <div className={styles.icon}>

        </div> */}
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
          <span><b>To Start</b></span>
        </div>
        <div className={styles.heading}>
          <span className={styles.dots} id={styles.dottwo}></span>
          <span><b>In Progress</b></span>
        </div>
        <div className={styles.heading}>
          <span className={styles.dots} id={styles.dotthree}></span>
          <span><b>Completed</b></span>
        </div>
      </div>

      {/* Swipeable container */}
      <div className={styles.swiperContainer} style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      >
        {/* "To Start" container with add task button */}
        <div  ref={(el) => (containerRefs.current[0] = el)} className={styles.container}id={styles.start}>
          <ul className={styles.list}>{renderCards("To Start")}</ul>
          <button ref={addButtonRef}
            onClick={() => setIsCardVisible(true)}
            className={styles.addTaskBtn}
          >
           
            Add New
          </button>
        </div>

        <div  ref={(el) => (containerRefs.current[1] = el)} className={styles.container} id={styles.prog}>
          <ul className={styles.list}>{renderCards("In Progress")}</ul>
        </div>

        <div  ref={(el) => (containerRefs.current[2] = el)} className={styles.container}id={styles.comp}>
          <ul className={styles.list}>{renderCards("Completed")}</ul>
        </div>
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
