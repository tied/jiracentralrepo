import ForgeUI, { render, Text, TextField, Fragment, ButtonSet, IssueGlance, IssuePanel, useState, Button, ModalDialog, Table, Row, Cell, Head, useProductContext, Form } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

let count = 0;

const fetchProjectData = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	var conanScores = [];
	
	for(var issuePropKeys of data.keys)
	{
		console.log("issuePropKeys :"+issuePropKeys);
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      const res1 = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${issuePropKeys.key}`);
      console.log("res1: "+res1);      
      const data1 = await res1.json();
      console.log("data1: "+ data1);
      count++;

			conanScores.push
			({
				"key": data1.value.name,
				"value" : data1.value.conanlink
			});
		}
	}
	
	console.log(conanScores);
	console.log("Count is:" +count);
	return conanScores;
}

const onSubmit = async (formData) => {
  console.log("Data from the Form:" + formData);
  console.log("Data from the Form:" + JSON.stringify(formData));

  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const res2 = await res.json();
  console.log("response 2: "+res2);
  const issueId = parseInt(res2.id);
  console.log("IssueID: "+issueId);
  
  /*let newbody = ` 
	{
	"issues":[
		{
		"issueID": ${issueId},
		"properties": {
			"myProperty4":
				{
				 "name": ${formData.name},
         "conanlink": ${formData.url}
               			}
      			      }
    		}
		]
	}`;*/
  let newbody2 = 
  {
    issues: [
  {
    issueId: issueId,
      properties: {
        myproperty4: {
          name: formData.name,
          conanlink: formData.url
        }
      }
    }
  ]
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/properties/multi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
	body: newbody2
    });
    const data = await response.json();
    console.log(data);
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());

};

let onEdit = (data) => {
  console.log("Data to be edited:" + data);
}

let onDelete = async (data) => {
  console.log("Data to be deleted:" + data);
}

const App = () => {

  const [conandata] = useState(async()=> await fetchProjectData());
  console.log(conandata);
  const [isOpen, setOpen] = useState(false);

  return (
    <Fragment>

      <Button text="Add New Link" onClick={() => setOpen(true)} />
      {isOpen && (
        <ModalDialog header="Add Conan Link" onClose={() => setOpen(false)}>
          <Form onSubmit={onSubmit} submitButtonText="Add">
            <TextField label="Name" name="name" isRequired="true"/>
            <TextField label="URL" name="url" isRequired="true" />
          </Form>
        </ModalDialog>
      )}
 
      <Table>
            <Head>
              <Cell>
                <Text>Name</Text>
              </Cell>
              <Cell>
                <Text>Link</Text>
               </Cell>
               <Cell>
                <Text>Action</Text>
               </Cell>
            </Head>
            {conandata.map(data => (
                <Row>
                  <Cell>
                    <Text>{data.key}</Text>
                  </Cell>
                  <Cell>
                    <Text>{data.value}</Text>
                  </Cell>
                  <Cell>
                      <ButtonSet>
                        <Button icon='edit' onClick={async () => {onEdit(data)}}></Button>
                        <Button icon='trash' onClick={async()=> await onDelete(data)}></Button>
                      </ButtonSet>
                  </Cell>
                </Row>
              ))}
      </Table>
    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App/>
  </IssueGlance>
);
