import React, { useEffect } from "react";

const Users = ({ changePath }) => {
  useEffect(() => {
    changePath();
  }, [changePath]);

  return <div>Users</div>;
};

export default Users;
