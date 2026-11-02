import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const client=new Client({name:'calm-rest-connection-check',version:'1.0.0'});
const transport=new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('server.mjs',import.meta.url))]});
try{await client.connect(transport);const {tools}=await client.listTools();assert.equal(tools.length,7);for(const tool of tools.filter(t=>t.annotations.readOnlyHint)){assert.equal(tool.annotations.readOnlyHint,true);const result=await client.callTool({name:tool.name,arguments:{}});assert.ok(!result.isError,tool.name+': '+result.content?.[0]?.text);assert.ok(JSON.parse(result.content[0].text));console.log('PASS '+tool.name);}assert.ok(tools.find(t=>t.name==='confirm_booking_and_email' && !t.annotations.readOnlyHint));console.log('Calm Rest Hotel: seven tools discovered, six live reports verified. Confirmation tool not executed by smoke test.');}finally{await client.close();}
