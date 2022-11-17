export const LanguageSelector = () => {
    return (<>
        <label htmlFor="language-selector" className="p-small">Language</label>
        <select className="select select-small" id="language-selector">
            <option value="1">Option one</option>
            <option value="2">Option two</option>
            <option value="3">Option three</option>
            <option value="4">Option four</option>
        </select>
    </>)
}