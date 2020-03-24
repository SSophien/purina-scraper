#pip install requests
import requests
import os, json
import pandas as pd

json_path = "./cats"
json_files = [pos_json for pos_json in os.listdir(json_path) if pos_json.endswith('.json')]
json_data = pd.DataFrame(columns=['name', 'size', 'coat', 'color', 'lifespan', 'imageLink'])

for index, js in enumerate(json_files):
    with open(os.path.join(json_path, js)) as json_file:
        json_text = json.load(json_file)

        # here you need to know the layout of your json and each json has to have
        # the same structure (obviously not the structure I have here)
        name = json_text['name']
        size = json_text['size']
        coat = json_text['coat']
        color = json_text['color']
        lifespan = json_text['lifespan']
        imageLink = json_text['imageLink']
        # here I push a list of data into a pandas DataFrame at row given by 'index'
        json_data.loc[index] = [name, size, coat, color, lifespan, imageLink]

print(json_data.imageLink)

for i in range(0, len(json_data)):
    image_name = json_data.name[i].lower().replace(' ', '_')
    with open('./cats/'+ image_name + '.jpg', 'wb') as handle:
            response = requests.get(json_data.imageLink[i], stream=True)
            if not response.ok:
                print(response)

            for block in response.iter_content(1024):
                if not block:
                    break

                handle.write(block)
