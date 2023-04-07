import axios from "axios";

export async function triggerWorkflow() {
  console.log("process.env", process.env);

  const token = process.env.GIT_HUB_TOKEN;
  const owner = process.env.WEB_LOG_CLIENT_REPOSITORY_OWNER;
  const repo = process.env.WEB_LOG_CLIENT_REPOSITORY;
  // mainブランチをしていする
  const ref = "main";
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/api_build_deploy.yml/dispatches`;

  axios
    .post(
      url,
      { ref },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch(function (error) {
      throw new Error(error);
    });
}
