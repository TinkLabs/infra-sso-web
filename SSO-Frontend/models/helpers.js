// export function arrayGetterSetter(name) {
//     return {
//         get() {
//             let values = [];

//             try {
//                 values = JSON.parse(this.getDataValue(name));

//                 if (Array.isArray(values)) {
//                     return values;
//                 }
//             } catch (e) {
//             }

//             return values;
//         },
//         set(values) {
//             if (Array.isArray(values)) {
//                 this.setDataValue(name, JSON.stringify(values));
//             }
//         },
//     };
// }