import{Datamanager as e}from"../Aggregator.js";export class Validator extends e{constructor(){super()}validate_categoryName(e,r){let t=0;return r.forEach(r=>{r.toLowerCase()===e.toLowerCase()&&t++}),0===t&&""!==e}validateAmount(e){return!!Array.isArray(e.match(/^\d+((\.|,)\d{1,2})?$/))}validateUserName(e,r){if(!r)return""!==e;if(null!=r){let t=0;return r.forEach(r=>{r.name.toLowerCase()===e.toLowerCase()&&t++}),0===t&&""!==e}}}