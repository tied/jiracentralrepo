import ForgeUI, { render, Text, TextField, Tabs, Tab, Fragment, Link,
  ButtonSet, IssueGlance, IssuePanel, useState, Button, ModalDialog, Table, Row, Cell, Head, useProductContext, Form } from '@forge/ui';
import api, { fetch, route } from '@forge/api';

const App = () => {

const [isOpen, setOpen] = useState(false);
const [isOpen1, setOpen1] = useState(false);

var conanScores = [];

const fetchProjectData = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	for(var issuePropKeys of data.keys)
	{
		console.log("issuePropKeys :"+issuePropKeys);
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      const res1 = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${issuePropKeys.key}`);
      console.log("res1: "+res1);      
      const data1 = await res1.json();
      console.log("data1: "+ data1);

			conanScores.push
			({
        "id": data1.value.id,
				"key": data1.value.name,
				"value" : data1.value.conanlink
			});
		}
	}
	
	console.log(conanScores);
	return conanScores;
}
const keycounter = async() =>{
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  let count= 0;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties`);
  const data = await res.json();
	
	for(var issuePropKeys of data.keys)
	{
		
		if(issuePropKeys.key.includes("myProperty"))
		{
      count++;
		}
	}

	console.log("Count is:" +count);
	return count;
}

let [conandata, setconandata] = useState(async()=> await fetchProjectData());

let editId ="";
let editKey ="";
let editValue ="";

let [actualcount, setactualcount] = useState(async()=> await keycounter());

const onSubmit = async (formData) => {
  console.log("Data from the Form:" + formData);
  console.log("Data from the Form:" + JSON.stringify(formData));

  const context = useProductContext()
  const issueKey = context.platformContext.issueKey;

  const res = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  const res2 = await res.json();
  console.log("response 2: "+res2);
  const issueId = parseInt(res2.id);
  console.log("IssueID: "+issueId);
  
  
  console.log("Count inside onSubmit:" +actualcount);
  
  let propkey = ++actualcount;
  console.log("1 the key is= "+propkey);
  
  var propkey1 = propkey.toString()
  console.log("2 the key is= "+propkey1);
  
  var key= "myProperty".concat(propkey1);
  console.log("3 the key is= "+key);

  let newbody2 = 
  {
    id: key,
    name: formData.name,
    conanlink: formData.url
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody2));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${key}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
	body: JSON.stringify(newbody2)
    });
    //const data = await response.json();
    //console.log(data);
    //console.log(`Response: ${response.status} ${response.statusText}`);
    //console.log(await response.text());
    setconandata(conandata);

};

let afterEdit = async (formData) => {
  console.log("Inside afterEdit Data to be edited :" + JSON.stringify(formData));
  console.log("Inside afterEdit func: "+ editId);

  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

 let newbody2 = 
  {
    id: editId,
    name: formData.name,
    conanlink: formData.url,
  };

  console.log("Body created by the issueid is= " + JSON.stringify(newbody2));

    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${key}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
	body: JSON.stringify(newbody2)
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(await response.text());

}
let beforeEdit = async (a,b,c) => {
  console.log("1 Inside beforeEdit func: "+ a);
  console.log("2 Inside beforeEdit func: "+ b);
  console.log("3 Inside beforeEdit func: "+ c);

  editKey = a;
  editValue = b;
  editId = c;

  console.log("4 Inside beforeEdit func: "+ editId);
  console.log("5 Inside beforeEdit func: "+ editKey);
  console.log("6 Inside beforeEdit func: "+ editValue);
}
let onDelete = async (id) => {
  console.log("Key to be deleted:" + id);
  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;
  
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/properties/${id}`, {
    method: 'DELETE'
  });
  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.text());
}


  return (
    <Fragment>
      <Tabs>
        <Tab label="Details">
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
                <Text>Edit</Text>
               </Cell>
               <Cell>
                <Text>Delete</Text>
               </Cell>
            </Head>
            {conandata.map(data => (
                <Row>
                  <Cell>
                    <Text>{data.key}</Text>
                  </Cell>
                  <Cell>
                    <Text>
                      <Link appearance="link" href={data.value}>
                        {data.value}
                     </Link>
                    </Text>
                  </Cell>
                  <Cell>
                        <Button icon='edit' onClick={async () => {
                          beforeEdit(data.key, data.value, data.id);
                          setOpen1(true)
                        }} />
                        {isOpen1 && (
                            <ModalDialog header="Edit Conan Link" onClose={() => setOpen1(false)}>
                              <Form onSubmit={afterEdit} submitButtonText="Edit">
                                <TextField label="Name" name="name" isRequired="true"/>
                                <TextField label="Url" name="url" isRequired="true" />
                              </Form>
                            </ModalDialog>
                         )}
                  </Cell>
                  <Cell>
                      <Button icon='trash' onClick={async()=> await onDelete(data.id)}></Button>
                  </Cell>
                </Row>
              ))}
      </Table>
      </Tab>
      <Tab label="History">
          <Text>Hello from History Page</Text>
      </Tab>
      </Tabs>
    </Fragment>
  );
};

export const run = render(
  <IssueGlance>
    <App/>
  </IssueGlance>
);
