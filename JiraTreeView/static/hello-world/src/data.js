import api, { fetch, route } from '@forge/api';
import ForgeUI, { useProductContext } from '@forge/ui';
import { requestJira } from '@forge/bridge';

const projectKey = `OEM`;
let issues1 = [];

const fetchIssueList = async () =>{
              const context = useProductContext();
              console.log("1 inside fetchIssueList: ",context);
              console.log("2 inside fetchIssueList: ",JSON.stringify(context));
              const params = `project = ${projectKey}`;
              const res =  await requestJira(`/rest/api/2/search?jql=${params}`);
              console.log("3 inside fetchIssueList: ",res);
              console.log("3.5 inside fetchIssueList: ",JSON.stringify(res));
              const data =  await res.json();
              console.log("4 inside fetchIssueList: ",JSON.stringify(data));
              return data;
          }

export const issues =  fetchIssueList().then(result => 
            {
              console.log("5 inside issues.",result);
              result.issues.forEach((element) => {
                let item = 
                {
                    ID: element.id,
                    Head_ID: (element.fields.issuelinks.length != 0
                    ? element.fields.issuelinks[0].hasOwnProperty("outwardIssue")
                    ? element.fields.issuelinks[0].outwardIssue.id : -1 : -1),
                    Issue_Key: element.key,
                    Issue_Type: element.fields.issuetype.name,
                    Summary: element.fields.summary,
                    Assignee: (element.fields.assignee === null? "Unassigned":element.fields.assignee.displayName),
                    Reporter: element.fields.reporter.displayName,
                    Priority: element.fields.priority.name,
                }
              issues1.push(item);
              console.log("6 inside issues: ",JSON.stringify(item));
              });
              console.log("7 inside issues: ",JSON.stringify(issues1));
              return issues1;
          });

export default issues;