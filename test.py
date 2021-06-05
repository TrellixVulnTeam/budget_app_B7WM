def hamming_distance(str1, str2):
    if len(str1) != len(str2):
        return 'Not equal'
    ham_distance = 0
    for i in range(0, len(str1)):
        if str1[i] != str2[i]:
            ham_distance+=1
    return ham_distance


print(hamming_distance('ShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShane','ShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShaneShane'))
print(hamming_distance('Shane','Shafe'))
print(hamming_distance('Shane','Shrnt'))