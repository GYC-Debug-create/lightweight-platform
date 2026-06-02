const EmptyState = ({ message, actionText, onAction }) => {
  return (
    <div className="empty-state">
      <p>{message || "暂无数据"}</p>
      {actionText && (
        <button onClick={onAction}>{actionText}</button>
      )}
    </div>
  );
};

export default EmptyState;
