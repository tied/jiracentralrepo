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

//let [conandata, setconandata] = useState(async()=> await fetchProjectData());
let [selectedConan, setSelectedConan] = useState({ id: "", name: "", url: "" });
let [actualcount, setactualcount] = useState(async()=> await keycounter());
let [editKey, seteditKey] = useState("myProperty");

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
    //setconandata(conandata);

};

let onEdit = async (formData) => {
  console.log("Data to be edited :" + JSON.stringify(formData));
  console.log("1 Extra data :" + selectedConan.id);
  console.log("2 Extra data :" + selectedConan.name);
  console.log("3 Extra data :" + selectedConan.url);

  const context = useProductContext();
  const issueKey = context.platformContext.issueKey;

 /* let newbody2 = 
  {
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
    console.log(await response.text());*/

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
                        <Button icon='edit' onClick={async()=> setOpen1(true)} />
                        {isOpen1 && (
                            <ModalDialog header="Edit Conan Link" onClose={() => setOpen1(false)}>
                              <Form onSubmit={async (data) => {
                            await onEdit();
                            setSelectedConan({ name: data.key, url: data.value, id: data.id });
                            setOpen(false);
                        }} submitButtonText="Edit">
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
