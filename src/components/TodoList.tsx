import React, { useState, useEffect } from "react";
import "./TodoList.css";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // 初始化模拟数据
  useEffect(() => {
    const mockTodos: Todo[] = [
      {
        id: 1,
        title: "学习React",
        description: "完成React基础教程",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: "购物",
        description: "购买日常用品",
        completed: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ];
    setTodos(mockTodos);
  }, []);

  // 添加新的Todo项
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTodos([...todos, newTodo]);
    setTitle("");
    setDescription("");
    setIsAddFormOpen(false);
  };

  // 切换Todo项的完成状态
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString(),
            }
          : todo
      )
    );
  };

  // 开始编辑Todo项
  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  // 保存编辑后的Todo项
  const handleEditTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || editingId === null) return;

    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? { ...todo, title, description, updatedAt: new Date().toISOString() }
          : todo
      )
    );

    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  // 删除Todo项
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 取消编辑
  const cancelEdit = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">待办事项列表</h1>

      {/* 添加新Todo的按钮和表单 */}
      {!editingId && (
        <div className="add-todo-section">
          {!isAddFormOpen ? (
            <button
              className="add-todo-btn"
              onClick={() => setIsAddFormOpen(true)}
            >
              添加待办事项
            </button>
          ) : (
            <form onSubmit={handleAddTodo} className="todo-form">
              <div className="form-group">
                <label htmlFor="title">标题 *</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入待办事项标题"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">描述</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入待办事项描述（可选）"
                  className="form-textarea"
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsAddFormOpen(false);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  取消
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 编辑Todo的表单 */}
      {editingId !== null && (
        <div className="edit-todo-section">
          <h3>编辑待办事项</h3>
          <form onSubmit={handleEditTodo} className="todo-form">
            <div className="form-group">
              <label htmlFor="edit-title">标题 *</label>
              <input
                type="text"
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-description">描述</label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                更新
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todo列表 */}
      <div className="todo-list">
        {todos.length === 0 ? (
          <div className="empty-state">
            <p>暂无待办事项</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
            >
              <div className="todo-content">
                <div className="todo-header">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="todo-checkbox"
                  />
                  <h3 className="todo-item-title">{todo.title}</h3>
                </div>
                {todo.description && (
                  <p className="todo-item-description">{todo.description}</p>
                )}
                <div className="todo-meta">
                  <span className="todo-date">
                    创建于: {new Date(todo.createdAt).toLocaleString()}
                  </span>
                  <span className="todo-date">
                    更新于: {new Date(todo.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="todo-actions">
                <button
                  className="btn btn-small btn-edit"
                  onClick={() => startEdit(todo)}
                >
                  编辑
                </button>
                <button
                  className="btn btn-small btn-delete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
