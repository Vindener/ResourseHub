  import React, { useState, useEffect, useRef } from "react";
  import axios from "axios";
  import "./styles.css";

  const Notes = () => {
    const [allNotes, setAllNotes] = useState([]); // Всі нотатки
    const [notes, setNotes] = useState([]); // Відфільтровані нотатки
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [modalNote, setModalNote] = useState({ title: "", content: "", tags: [] });
    const [modalOpen, setModalOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);  
    const [editingTag, setEditingTag] = useState(null);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#FFD700"); // Жовтий за замовчуванням

    const [user, setUser] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);

    useEffect(() => {
      if (user?.id) {
      fetchNotes();
      fetchTags();
      }
    }, [user]);

    const fetchNotes = async () => {
    const res = await axios.get(`http://localhost:5000/notes?user_id=${user.id}`);
    const notesData = res.data;

    const notesWithTags = await Promise.all(
      notesData.map(async (note) => {
        const tagsRes = await axios.get(`http://localhost:5000/note_tags?note_id=${note.id}`);
        return { ...note, tags: tagsRes.data }; // Кожна мітка тепер має колір
      })
    );

    setAllNotes(notesWithTags);
    setNotes(notesWithTags);
  };



    const fetchTags = async () => {
    const res = await axios.get(`http://localhost:5000/tags?user_id=${user.id}`);
    setTags(res.data); // Тепер кожна мітка містить id, name і color
  };



    const deleteNote = async (id) => {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      fetchNotes();
    };

    const updateNote = async () => {
      if (!modalNote) return;
      await axios.put(`http://localhost:5000/notes/${modalNote.id}`, modalNote);
      fetchNotes();
      closeModal();
    };

  const toggleTagFilter = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };




const [isModalOpen, setIsModalOpen] = useState(false);
    const modalAddNote = {
    open: () => setIsModalOpen(true),
    close: () => setIsModalOpen(false),
    add: async () => {
      if (!newNote.content.trim()) {
      alert("Текст нотатки не може бути порожнім!");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/notes`, { 
        title: newNote.title.trim() || "", 
        content: newNote.content.trim(), 
        user_id: user.id
      });
      fetchNotes();
      setNewNote({ title: "", content: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Помилка при додаванні нотатки:", error);
    }
    },
  };




  const filterNotes = () => {
    return allNotes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()); // Додаємо пошук у контенті

      if (selectedTags.length === 0) return matchesSearch;

      const matchesTags = selectedTags.some(tagId =>
        note.tags.some(tag => tag.id === tagId)
      );

      return matchesSearch && matchesTags;
    });
  };


  const openModal = async (note) => {
    try {
      const tagsRes = await axios.get(`http://localhost:5000/note_tags?note_id=${note.id}`);
      const noteWithTags = { ...note, tags: tagsRes.data }; // Тут зберігаємо масив об'єктів, а не просто `name`

      setModalNote(noteWithTags);
      setModalOpen(true);
    } catch (error) {
      console.error("Помилка при завантаженні міток:", error);
    }
  };


  useEffect(() => {
    console.log("Modal state updated:", modalOpen, modalNote);
  }, [modalOpen, modalNote]);


  const addTagToNote = async (tagName) => {
    if (!modalNote) return;

    try {
      const res = await axios.post("http://localhost:5000/tags", {
        user_id: user.id,
        name: tagName,
        color: newTagColor, // Використовуємо обраний колір
      });

      const tagId = res.data.id;
      await axios.post("http://localhost:5000/note_tags", {
        note_id: modalNote.id,
        tag_id: tagId,
      });

      const newTag = { id: tagId, name: tagName, color: newTagColor };
      setModalNote((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));

      fetchNotes();
    } catch (error) {
      console.error("Помилка при додаванні мітки:", error);
    }
  };



  const updateTagName = async (tag) => {
    if (!newTagName.trim()) return;

    try {
      const res = await axios.put("http://localhost:5000/tags/update", {
        id: tag.id,
        newName: newTagName,
        newColor: tag.color, // Колір не змінюємо тут
      });

      console.log(res.data.message);

      // Оновлюємо стан у модальному вікні та у списку міток
      setModalNote((prev) => ({
        ...prev,
        tags: prev.tags.map((t) =>
          t.id === tag.id ? { ...t, name: newTagName } : t
        ),
      }));

      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id ? { ...t, name: newTagName } : t
        )
      );

      setEditingTag(null);
    } catch (error) {
      console.error("Помилка оновлення мітки:", error);
    }
  };

  const updateTagColor = async (tag, color) => {
    try {
      const res = await axios.put("http://localhost:5000/tags/update", {
        id: tag.id,
        newName: tag.name, // Назву не змінюємо тут
        newColor: color,
      });

      console.log(res.data.message);

      setModalNote((prev) => ({
        ...prev,
        tags: prev.tags.map((t) =>
          t.id === tag.id ? { ...t, color } : t
        ),
      }));

      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id ? { ...t, color } : t
        )
      );
    } catch (error) {
      console.error("Помилка оновлення кольору мітки:", error);
    }
  };


  const removeTagFromNote = async (tag) => {
    if (!modalNote) return;

    try {
      // Знаходимо id мітки
      const tagObj = tags.find((t) => t.name === tag);
      if (!tagObj) return;

      await axios.delete("http://localhost:5000/note_tags", {
        data: { note_id: modalNote.id, tag_id: tagObj.id },
      });

      // Оновлюємо локальний стан
      setModalNote((prev) => ({
        ...prev,
        tags: prev.tags.filter((t) => t !== tag),
      }));

      // Оновлюємо список заміток та міток
      fetchNotes();
      fetchTags();
    } catch (error) {
      console.error("Помилка при видаленні мітки:", error);
    }
  };


  const addExistingTagToNote = async (tagId) => {
    if (!modalNote) return;

    try {
      await axios.post("http://localhost:5000/note_tags", {
        note_id: modalNote.id,
        tag_id: tagId,
      });

      // Оновлюємо список міток у поточній замітці
      const selectedTag = tags.find(tag => tag.id === tagId);
      if (selectedTag) {
        setModalNote((prev) => ({
          ...prev,
          tags: [...prev.tags, selectedTag.name],
        }));
      }

      fetchNotes(); // Оновлюємо список заміток
    } catch (error) {
      console.error("Помилка при додаванні мітки:", error);
    }
  };

    const closeModal = () => {
    setModalOpen(false);
    setModalNote({ title: "", content: "", tags: [] });
  };

  const filteredNotes = filterNotes();

  console.log("Rendering modal:", modalOpen, modalNote);


    const editModalRef = useRef(null);   // для modalOpen (редагування нотатки)
const addModalRef = useRef(null);    // для isModalOpen (додавання нотатки)

useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      editModalRef.current &&
      !editModalRef.current.contains(e.target) &&
      modalOpen
    ) {
      closeModal(); // Закриваємо редагування
    }

    if (
      addModalRef.current &&
      !addModalRef.current.contains(e.target) &&
      isModalOpen
    ) {
      setIsModalOpen(false); // Закриваємо додавання
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [modalOpen, isModalOpen]);


    return (
      <div className="notes-container">
        <header className="notes-header">
          <div className="filter-container">
            <button onClick={() => setFilterOpen(!filterOpen)}>
              <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft:"20px"}}>
              <path d="M13.6246 12.9982V24.3789C13.6771 24.8122 13.5459 25.2743 13.2441 25.5776C13.1227 25.7115 12.9784 25.8177 12.8197 25.8902C12.6609 25.9627 12.4908 26 12.3189 26C12.147 26 11.9768 25.9627 11.8181 25.8902C11.6593 25.8177 11.5151 25.7115 11.3937 25.5776L8.75594 22.6747C8.61289 22.5207 8.50412 22.3323 8.4381 22.1244C8.37209 21.9164 8.35062 21.6945 8.37536 21.476V12.9982H8.33599L0.77704 2.33968C0.563931 2.0386 0.467771 1.65693 0.509574 1.27806C0.551377 0.899192 0.727743 0.553936 1.00013 0.317735C1.24948 0.11554 1.52506 0 1.81377 0H20.1862C20.4749 0 20.7505 0.11554 20.9999 0.317735C21.2723 0.553936 21.4486 0.899192 21.4904 1.27806C21.5322 1.65693 21.4361 2.0386 21.223 2.33968L13.664 12.9982H13.6246Z" fill="#24418A"/>
              </svg>
              Фільтрувати за мітками
            </button>

            {filterOpen && (
              <div className="filter-dropdown">
                {tags.map((tag) => (
                  <div key={tag.id} className="filter-tag" onClick={() => toggleTagFilter(tag.id)}>
                    <input type="checkbox" checked={selectedTags.includes(tag.id)} readOnly />
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Пошук"
            value={searchQuery}
            className="search-bar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <button className="add-note-modal" onClick={modalAddNote.open}>
            <svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="45" height="40" rx="20" fill="#F6D868"/>
            <path d="M33 21.5H24V30.5H21V21.5H12V18.5H21V9.5H24V18.5H33V21.5Z" fill="#776935"/>
            </svg>

          </button>

        </header>

        <div className="notes-grid">
          {filterNotes().map(note => (
            <div key={note.id} className="note" >
              <div className="tags-container"onClick={() => openModal(note)}>
                {(note.tags || []).map(tag => (
                  <span key={tag.id} className="tag"
                    style={{ backgroundColor: tag.color, color: "#fff" }}
                  >{tag.name}</span> // Використовуємо `tag.name` замість всього об'єкта
                ))}
              </div>

              <h3 className="note-title" onClick={() => openModal(note)}>{note.title} </h3>
              <svg onClick={() => deleteNote(note.id)} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.16663 14.5C4.79996 14.5 4.48618 14.3696 4.22529 14.1087C3.9644 13.8478 3.83374 13.5338 3.83329 13.1667V4.5H3.16663V3.16667H6.49996V2.5H10.5V3.16667H13.8333V4.5H13.1666V13.1667C13.1666 13.5333 13.0362 13.8473 12.7753 14.1087C12.5144 14.37 12.2004 14.5004 11.8333 14.5H5.16663ZM6.49996 11.8333H7.83329V5.83333H6.49996V11.8333ZM9.16663 11.8333H10.5V5.83333H9.16663V11.8333Z" fill="#554560" />
              </svg>
              <p className="note-content" onClick={() => openModal(note)}>
                {note.content.length > 100 ? note.content.substring(0, 100) + "..." : note.content}
              </p>

            </div>
          ))}
        </div>

        {modalOpen && modalNote && (
          <div className="modal">
            <div className="modal-content" ref={editModalRef}>
              <input
                type="text"
                className="modal-input modal-title"
                value={modalNote.title}
                onChange={(e) => setModalNote({ ...modalNote, title: e.target.value })}
              />
              <textarea
                className="modal-input"
                value={modalNote.content}
                onChange={(e) => setModalNote({ ...modalNote, content: e.target.value })}
              ></textarea>
              <div className="tags-container">
                {modalNote.tags.length > 0 ? (
                  modalNote.tags.map((tag, index) => (
                    <span key={tag.id || index} className="tag"
                          style={{ backgroundColor: tag.color, color: "#fff" }}>
                      {editingTag?.id === tag.id ? (
                        <>
                        <input
                          className="tag-input"
                          type="text"
                          style={{ backgroundColor: tag.color, color: "#fff" }}
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          onBlur={() => updateTagName(tag)}
                          onKeyDown={(e) => e.key === "Enter" && updateTagName(tag)}
                        />
                         <div className="tag-colors">
                        {["#FFD700", "#87CEEB", "#FF6347", "#90EE90"].map((color) => (
                          <span
                            key={color}
                            className="color-dot"
                            style={{
                              backgroundColor: color,
                              border: color === tag.color ? "3px solid black" : "none",
                            }}
                            onClick={() => updateTagColor(tag, color)}
                          ></span>
                        ))}
                      </div>
                      </>
                      ) : (
                        <span
                          onClick={() => {
                            setEditingTag(tag);
                            setNewTagName(tag.name);
                          }}
                        >
                          {tag.name}
                        </span>
                      )}
                        <svg onClick={() => removeTagFromNote(tag.id)} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.16663 14.5C4.79996 14.5 4.48618 14.3696 4.22529 14.1087C3.9644 13.8478 3.83374 13.5338 3.83329 13.1667V4.5H3.16663V3.16667H6.49996V2.5H10.5V3.16667H13.8333V4.5H13.1666V13.1667C13.1666 13.5333 13.0362 13.8473 12.7753 14.1087C12.5144 14.37 12.2004 14.5004 11.8333 14.5H5.16663ZM6.49996 11.8333H7.83329V5.83333H6.49996V11.8333ZM9.16663 11.8333H10.5V5.83333H9.16663V11.8333Z" fill="#554560" />
                        </svg>
                    </span>
                  ))
                ) : (
                  <p></p>
                )}
              </div>


              <select className="tag-select" onChange={(e) => addExistingTagToNote(Number(e.target.value))}>
                <option value="" >Оберіть мітку із існуючих</option>
                {tags
                  .filter((tag) => !modalNote.tags.includes(tag.name)) // Виключаємо вже додані мітки
                  .map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
              </select>


              

              <div className="tag-colors">
                <input
                  type="text"
                  className="new-tag-input"
                  placeholder="Напишіть назву мітки..."
                  onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addTagToNote(e.target.value.trim());
                    e.target.value = "";
                  }
                }}
                />
                <div className="tag-colors-container">
                  <p>Оберіть колір мітки</p>
                  {["#FFD700", "#87CEEB", "#FF6347", "#90EE90"].map((color) => (
                    <span
                      key={color}
                      className="color-dot"
                      style={{
                        backgroundColor: color,
                        border: color === newTagColor ? "3px solid black" : "none", // Обведення для вибраного
                      }}
                      onClick={() => setNewTagColor(color)}
                    ></span>
                  ))}
                </div>
              </div>


              <button onClick={updateNote} className="save-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V8L16 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21ZM7 5H11V7H13V5H15V9H7V5ZM7 13H17V19H7V13Z" fill="#24418A"/>
                </svg>
                Зберегти</button>
              <button onClick={closeModal} className="save-btn">Закрити</button>
            </div>
          </div>
        )}

        {isModalOpen && (
        <div className="modal">
          <div className="modal-content" ref={editModalRef}>
          <input
            type="text"
            className="modal-input"
            placeholder="Назва.."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          />
          <textarea
            className="modal-input"
            placeholder="Почніть введення"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          ></textarea>
            <button className="save-btn"  onClick={modalAddNote.add}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V8L16 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21ZM7 5H11V7H13V5H15V9H7V5ZM7 13H17V19H7V13Z" fill="#24418A"/>
              </svg>

              Зберегти</button>
            <button className="save-btn" onClick={modalAddNote.close}>Скасувати</button>
          </div>
        </div>
      )}

        
      </div>
    );
  };

  export default Notes;