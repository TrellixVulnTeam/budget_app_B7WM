nest_array = [[[1, 2, 3, 4], 5, 6, 7, 8], 9, [10]]
nest_array_2 = []
nest_array_3 = [1, 2, [[[3]], 4]]
nest_array_4 = [[[[[[[[1]]]]]]]]
new_array = []



def find_inner_list(item):
    if len(item) == 0:
        return 0
    else:
        for inner_item in item:
            if type(inner_item) is list:
                ind = int(item.index(inner_item)) + 1
                return find_inner_list(inner_item), find_inner_list(item[ind:])
            else:
                new_array.append(inner_item)

# for item in nest_array:
#     if type(item) is list:
#         new_array.append(find_inner_list(item))
#     else:
#         new_array.append(item)

find_inner_list(nest_array_4)

print(new_array)