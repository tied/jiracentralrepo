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
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  console.log("Data from the Form:" + formData);
  console.log("Data from the Form:" + JSON.stringify(formData));
  console.log("Count is:"+ count);
  
  var bodyData = `{
    "name": ${formData.name},
    "conanlink": ${formData.url},
  }`;
  console.log("bodyData: "+ bodyData);

  const putres = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/myProperty4`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: bodyData
});
console.log(`Response: ${putres.status} ${putres.statusText}`);
console.log(await putres.json());

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
            <TextField label="Name" name="name" />
            <TextField label="URL" name="url" />
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
