const ProfileField = ({ label, value }) => {
  return (
    <div className="profile__field">
      <h3 className="profile__field-label">{label}</h3>
      <h2 className="profile__field-value">{value}</h2>
    </div>
  );
};
export default ProfileField;