import {defineStore} from 'pinia';
import {ref, watch} from 'vue';

export interface Tag {
    title: string;
    name: string;
}

function initState() {
    const savedTags = localStorage.getItem('tags');
    const initialTags = savedTags ? JSON.parse(savedTags) : [
        {
            title: "主页",
            name: "home"
        }
    ];

    return {
        tags: initialTags as Tag[]
    }
}

export const useTagStore = defineStore('tag', () => {
    const state = ref(initState());

    // 监视 tags 的变化并更新 localStorage
    watch(() => state.value.tags, (newTags) => {
        localStorage.setItem('tags', JSON.stringify(newTags));
    }, {deep: true});

    const addTag = (newTag: Tag) => {
        state.value.tags.push(newTag);
    };

    const removeTag = (tagName: string) => {
        state.value.tags = state.value.tags.filter(tag => tag.name !== tagName);
    };

    return {state, addTag, removeTag};
});
