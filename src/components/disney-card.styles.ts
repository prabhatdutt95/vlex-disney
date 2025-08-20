import { css } from "lit";

export const cardStyles = css`
  /* Card */
  .card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    width: 260px;
    margin: 1rem;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .card:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
  }

  .header {
    font-weight: bold;
    padding: 0.75rem;
    font-size: 1.1rem;
    background: #f7f7f7;
  }

  .image {
    width: 100%;
    height: 220px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .card:hover .image img {
    transform: scale(1.1);
  }

  /* Dialog Overlay */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  /* Dialog Content */
  .dialog {
    background: #fff;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
    position: relative;
    padding-bottom: 1rem;
    outline: none; /* important for focus */
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-weight: bold;
    font-size: 1.3rem;
    border-bottom: 1px solid #eee;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
    transition: color 0.2s;
  }
  .close-btn:hover {
    color: #000;
  }

  .dialog-body {
    padding: 1rem;
    text-align: left;
  }

  .dialog-image {
    width: 100%;
    height: 300px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .dialog-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .property {
    margin: 0.5rem 0;
    font-size: 0.95rem;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .favorite-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .favorite-btn:hover {
    transform: scale(1.2);
  }

  .favorite-btn[aria-pressed="true"] {
    color: red;
  }
`;
