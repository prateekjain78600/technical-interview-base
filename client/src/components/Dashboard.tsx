import React, { useState, FormEvent } from "react";

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Todo {
  id: number;
  title: string;
  categoryId: number | null;
  tagIds: number[];
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [todoCategoryId, setTodoCategoryId] = useState<number | null>(null);
  const [todoTagIds, setTodoTagIds] = useState<number[]>([]);

  const [filterCategoryId, setFilterCategoryId] = useState<number | null>(null);
  const [filterTagId, setFilterTagId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // new state for search

  const generateId = (items: { id: number }[]) => (items.length ? items[items.length - 1].id + 1 : 1);

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategories([...categories, { id: generateId(categories), name: newCategoryName.trim(), description: newCategoryDesc.trim() }]);
    setNewCategoryName("");
    setNewCategoryDesc("");
  };

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setTags([...tags, { id: generateId(tags), name: newTagName.trim() }]);
    setNewTagName("");
  };

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    setTodos([
      ...todos,
      {
        id: generateId(todos),
        title: todoTitle.trim(),
        categoryId: todoCategoryId,
        tagIds: todoTagIds,
        completed: false,
      },
    ]);
    setTodoTitle("");
    setTodoCategoryId(null);
    setTodoTagIds([]);
  };

  const toggleTagSelection = (tagId: number) => {
    if (todoTagIds.includes(tagId)) {
      setTodoTagIds(todoTagIds.filter((id) => id !== tagId));
    } else {
      setTodoTagIds([...todoTagIds, tagId]);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (searchTerm.trim() && !todo.title.toLowerCase().includes(searchTerm.trim().toLowerCase())) {
      return false;
    }
    if (filterCategoryId && todo.categoryId !== filterCategoryId) return false;
    if (filterTagId && !todo.tagIds.includes(filterTagId)) return false;
    return true;
  });

  const getCategoryName = (id: number | null) => categories.find((c) => c.id === id)?.name || "None";
  const getTagNames = (tagIds: number[]) => tagIds.map((id) => tags.find((t) => t.id === id)?.name || "").filter(Boolean).join(", ");

  const toggleComplete = (todoId: number) => {
    setTodos(todos.map(todo => todo.id === todoId ? { ...todo, completed: !todo.completed } : todo));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-900 p-6 md:p-12 font-sans max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 drop-shadow-md">
        Todo Dashboard with Categories & Tags
      </h1>

      {/* Add Category Section */}
      <section className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-indigo-200">
        <h2 className="text-2xl font-semibold mb-4 border-b border-indigo-300 pb-2 text-indigo-600">
          Add Category
        </h2>
        <form onSubmit={handleAddCategory} className="flex flex-col gap-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="border border-indigo-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newCategoryDesc}
            onChange={(e) => setNewCategoryDesc(e.target.value)}
            className="border border-indigo-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Add Category
          </button>
        </form>
        <div className="mt-6 text-center text-indigo-700 font-medium tracking-wide">
          Existing Categories:{" "}
          <span className="text-indigo-900 font-bold">
            {categories.length ? categories.map((c) => c.name).join(", ") : "None"}
          </span>
        </div>
      </section>

      {/* Add Tag Section */}
      <section className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-green-200">
        <h2 className="text-2xl font-semibold mb-4 border-b border-green-300 pb-2 text-green-600">
          Add Tag
        </h2>
        <form onSubmit={handleAddTag} className="flex gap-3 max-w-md mx-auto items-center">
          <input
            type="text"
            placeholder="Tag Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="border border-green-300 rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button type="submit" className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition">
            Add Tag
          </button>
        </form>
        <div className="mt-6 text-center text-green-700 font-medium tracking-wide">
          Existing Tags:{" "}
          <span className="text-green-900 font-bold">
            {tags.length ? tags.map((t) => t.name).join(", ") : "None"}
          </span>
        </div>
      </section>

      {/* Add Todo Section */}
      <section className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-purple-200 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b border-purple-300 pb-2 text-purple-600">
          Add Todo
        </h2>
        <form onSubmit={handleAddTodo} className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Todo Title"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className="border border-purple-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <select
            value={todoCategoryId ?? ""}
            onChange={(e) => setTodoCategoryId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-purple-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Category (optional)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div>
            <label className="block mb-2 font-semibold text-purple-700">Select Tags (click to toggle):</label>
            <div className="flex flex-wrap gap-3">
              {tags.length ? (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTagSelection(tag.id)}
                    className={`px-4 py-2 rounded-full border transition-colors duration-300 ${
                      todoTagIds.includes(tag.id)
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-100"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 italic">No tags created yet.</p>
              )}
            </div>
          </div>

          <button type="submit" className="bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition">
            Add Todo
          </button>
        </form>
      </section>

      {/* Filter Section (with Search Bar) */}
      <section className="mb-10 bg-white rounded-lg shadow-lg p-6 border border-red-200 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 border-b border-red-300 pb-2 text-red-600">
          Filter Todos
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search todos by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-red-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <div className="flex flex-wrap gap-4 justify-center">
          <select
            value={filterCategoryId ?? ""}
            onChange={(e) => setFilterCategoryId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-red-300 rounded-lg p-3 w-48 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterTagId ?? ""}
            onChange={(e) => setFilterTagId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-red-300 rounded-lg p-3 w-48 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setFilterCategoryId(null);
              setFilterTagId(null);
              setSearchTerm("");
            }}
            className="bg-red-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Todo List */}
      <section className="bg-white rounded-lg shadow-lg p-6 border border-gray-300 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 text-gray-800">
          Todo List
        </h2>
        {filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 italic">No todos found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="border rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
              >
                <div>
                  <h3
                    className={`text-xl font-semibold ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Category:{" "}
                    <strong className="text-indigo-700">{getCategoryName(todo.categoryId)}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Tags: <strong className="text-green-700">{getTagNames(todo.tagIds) || "None"}</strong>
                  </p>
                </div>
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    todo.completed
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {todo.completed ? "Completed" : "Mark Complete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
