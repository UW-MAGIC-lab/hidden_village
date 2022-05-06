
const ConjecturePreview = (props) => {
    const { onGetConjecture } = props;

    return (
        <div>
            <label className="flex justify-center font-bold text-xl w-full m-3">Conjecture Preview</label>
            <div className="flex justify-center">
                <button
                className="
                bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
                onClick={() => {
                    onGetConjecture();
                }}
                >
                Save
                </button>
            </div>
        </div>
    );
};

export default ConjecturePreview;